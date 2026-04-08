import api from "@/api/api";
import { create } from "zustand";
import { Overview, OverviewFilters } from "@/types/Question";
import handleError from "@/util/handleError";
import { ZustandResponse } from "@/types/Zustand";
import { AxiosResponse } from "@/types/Axios";
import { ErrorType } from "@/types/Error";

interface QuestionOverviewState {
    questions: Overview[];
    page: number;
    selectedQuestionIndex: number | null;
    selectedFilter: OverviewFilters;
    isLoading: boolean;

    fetchQuestions: (loadMore?: boolean) => Promise<ZustandResponse>;
    setSelectedFilter: (filter: OverviewFilters) => void;
    toggleStarQuestion: (id: number, isStarred: boolean) => Promise<void>;
}

const useQuestionOverviewStore = create<QuestionOverviewState>((set, get) => ({
    questions: [],
    page: 1,
    selectedQuestionIndex: null,
    selectedFilter: "all",
    isLoading: false,

    fetchQuestions: async (loadMore = false) => {
        const { questions, page } = get();

        if (!loadMore) {
            set({ isLoading: true });
        }

        try {
            const nextPage = loadMore ? page + 1 : 1;

            const res = await api.get<AxiosResponse<Overview[]>>(
                `/question/overview?sortBy=id.asc&limit=100&page=${nextPage}&starred=${useQuestionOverviewStore.getState().selectedFilter === "starred"}`,
            );

            if (!res.data.data) {
                return { success: false, errorType: ErrorType.SERVER };
            }

            if (questions.length === 0 || !loadMore) {
                set({ questions: res.data.data, page: 1 });
            } else {
                set({ questions: [...questions, ...res.data.data], page: nextPage });
            }

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
                await api.delete<AxiosResponse<void>>(`/question/starred/${id}`);
            } else {
                await api.post<AxiosResponse<void>>(`/question/starred/${id}`);
            }
        } catch (e) {
            console.log("Error toggling star:", e);
        }
    },
}));

export default useQuestionOverviewStore;
