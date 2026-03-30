import api from "@/api/api";
import { create } from "zustand";
import { Question } from "@/types/question";
import useQuestionOverviewStore from "./useQuestionOverview";
import { isAxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { ZustandResponse } from "@/types/store";
import { ErrorCodeMapping, ErrorType } from "@/types/error";

interface QuestionState {
    question: Question | null;
    selectedOptionId: number | null;
    isLoading: boolean;

    fetchQuestion: (questionId: number) => Promise<ZustandResponse>;
    fetchNextQuestion: (currentQuestionId: number) => Promise<ZustandResponse>;
    submitAnswer: (questionId: number, selectedOptionId: number) => Promise<ZustandResponse>;
}

const handleError = (e: unknown): ZustandResponse => {
    if (isAxiosError(e)) {
        const status = e.response?.status;
        const errorType = ErrorCodeMapping[status || 500];

        return { success: false, errorType };
    }

    return { success: false, errorType: ErrorType.NETWORK };
};

const useQuestionStore = create<QuestionState>((set, get) => ({
    question: null,
    selectedOptionId: null,
    isLoading: false,

    fetchQuestion: async (questionId: number) => {
        set({ isLoading: true });

        try {
            const res = await api.get<ApiResponse>(`/question/${questionId}`);
            set({ question: res.data.data });

            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchNextQuestion: async (currentQuestionId: number) => {
        set({ isLoading: true });

        const isStarredFilter = useQuestionOverviewStore.getState().selectedFilter === "starred";

        try {
            const res = await api.get<ApiResponse>(
                `/question/${currentQuestionId}/next?sortBy=id.asc&starred=${isStarredFilter}`,
            );
            set({ question: res.data.data, selectedOptionId: null });

            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    submitAnswer: async (questionId: number, selectedOptionId: number) => {
        const wasCorrect = selectedOptionId === (get().question?.correct_option_id ?? -1);

        try {
            await api.post<ApiResponse>(`/question/history/${questionId}`, {
                wasCorrect,
            });

            return { success: true };
        } catch (e) {
            return handleError(e);
        }
    },
}));

export default useQuestionStore;
