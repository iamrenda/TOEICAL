import api from "@/api/api";
import { AxiosResponse } from "@/types/Axios";
import { ErrorType } from "@/types/Error";
import { UserWritingHistory } from "@/types/Writing";
import { ZustandResponse } from "@/types/Zustand";
import handleError from "@/util/handleError";
import { create } from "zustand";

interface WritingHistory {
    isLoading: boolean;

    // YYYY-MM-DD
    selectedDate: string;
    setSelectedDate: (date: string) => void;

    selectedEntries: UserWritingHistory[] | null;
    setSelectedEntries: () => void;

    currentMonth: number;
    currentYear: number;
    setNextMonth: () => void;
    setPreviousMonth: () => void;

    currentMonthHistory: UserWritingHistory[];
    getCurrentMonthHistory(): Promise<ZustandResponse>;
}

const today = new Date();

const useWritingHistory = create<WritingHistory>((set, get) => ({
    isLoading: false,

    selectedDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
    setSelectedDate: (date) => {
        set({ selectedDate: date });
        get().setSelectedEntries();
    },

    selectedEntries: null,
    setSelectedEntries: () => {
        const { selectedDate, currentMonthHistory } = get();

        if (!selectedDate) {
            set({ selectedEntries: null });
            return;
        }

        const entries = currentMonthHistory.filter((entry) => entry.created_at.startsWith(selectedDate));

        set({ selectedEntries: entries });
    },

    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    setNextMonth: () => {
        set((state) => {
            const newMonth = state.currentMonth === 12 ? 1 : state.currentMonth + 1;
            const newYear = newMonth === 1 ? state.currentYear + 1 : state.currentYear;
            const newSelectedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;

            return { currentMonth: newMonth, currentYear: newYear, selectedDate: newSelectedDate };
        });
    },
    setPreviousMonth: () => {
        set((state) => {
            const newMonth = state.currentMonth === 1 ? 12 : state.currentMonth - 1;
            const newYear = newMonth === 12 ? state.currentYear - 1 : state.currentYear;
            const newSelectedDate = `${newYear}-${String(newMonth).padStart(2, "0")}-01`;
            return {
                currentMonth: newMonth,
                currentYear: newYear,
                selectedDate: newSelectedDate,
            };
        });
    },

    currentMonthHistory: [],
    getCurrentMonthHistory: async () => {
        const { currentMonth, currentYear } = get();

        set({ isLoading: true });

        try {
            const formattedYear = String(currentYear);
            const formattedMonth = String(currentMonth).padStart(2, "0");
            const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

            const res = await api.get<AxiosResponse<UserWritingHistory[]>>(
                `writing/history?from=${formattedYear}-${formattedMonth}-01&to=${formattedYear}-${formattedMonth}-${daysInMonth}`,
            );

            if (res.data.status !== "success") {
                return { success: false, error: ErrorType.SERVER };
            }

            set({ currentMonthHistory: res.data.data });

            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useWritingHistory;
