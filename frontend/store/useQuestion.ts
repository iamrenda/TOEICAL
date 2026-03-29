import api from "@/api/api";
import { create } from "zustand";
import { Question } from "@/types/question";
import useQuestionOverviewStore from "./useQuestionOverview";
import { apiErrorCodeTypeMapping, ApiErrorType } from "@/types/error";
import { isAxiosError } from "axios";

interface FetchQuestionResponse {
    success: boolean;
    errorType?: ApiErrorType;
}

interface QuestionState {
    question: Question | null;
    selectedOptionId: number | null;
    isLoading: boolean;

    fetchQuestion: (questionId: number) => Promise<FetchQuestionResponse>;
    fetchNextQuestion: (currentQuestionId: number) => Promise<FetchQuestionResponse>;
    submitAnswer: (questionId: number, selectedOptionId: number) => Promise<FetchQuestionResponse>;
}

const handleError = (e: unknown): FetchQuestionResponse => {
    if (isAxiosError(e)) {
        const status = e.response?.status;
        const errorType = apiErrorCodeTypeMapping[status || 500];

        return { success: false, errorType };
    }

    return { success: false, errorType: ApiErrorType.NETWORK_ERROR };
};

const useQuestionStore = create<QuestionState>((set, get) => ({
    question: null,
    selectedOptionId: null,
    isLoading: false,

    fetchQuestion: async (questionId: number) => {
        set({ isLoading: true });

        try {
            const res = await api.get(`/question/${questionId}`);
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
            const res = await api.get(`/question/${currentQuestionId}/next?sortBy=id.asc&starred=${isStarredFilter}`);
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
            await api.post(`/question/history/${questionId}`, {
                wasCorrect,
            });

            return { success: true };
        } catch (e) {
            return handleError(e);
        }
    },
}));

export default useQuestionStore;
