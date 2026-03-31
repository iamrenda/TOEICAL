import api from "@/api/api";
import { create } from "zustand";
import { Overview, OverviewFilters } from "@/types/Question";
import handleError from "@/util/handleError";
import { ZustandResponse } from "@/types/Zustand";

interface QuestionOverviewState {
    questions: Overview[];
    selectedQuestionIndex: number | null;
    selectedFilter: OverviewFilters;
    isLoading: boolean;

    fetchQuestions: () => Promise<ZustandResponse>;
    setSelectedFilter: (filter: OverviewFilters) => void;
    toggleStarQuestion: (id: number, isStarred: boolean) => Promise<void>;
}

const useQuestionOverviewStore = create<QuestionOverviewState>((set, get) => ({
    questions: [],
    selectedQuestionIndex: null,
    selectedFilter: "all",
    isLoading: false,

    fetchQuestions: async () => {
        set({ isLoading: true });

        try {
            const res = await api.get(
                `/question/overview?sortBy=id.asc&limit=100&page=1&starred=${useQuestionOverviewStore.getState().selectedFilter === "starred"}`,
            );
            set({ questions: res.data.data });

            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    setSelectedFilter: (filter) => {
        set({ selectedFilter: filter });
        get().fetchQuestions();
    },

    toggleStarQuestion: async (id, isStarred) => {
        try {
            if (isStarred) {
                await api.delete(`/question/starred/${id}`);
            } else {
                await api.post(`/question/starred/${id}`);
            }
        } catch (e) {
            console.log("Error toggling star:", e);
        }
    },
}));

export default useQuestionOverviewStore;
