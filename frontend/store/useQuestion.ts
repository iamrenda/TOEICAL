import api from "@/api/api";
import { create } from "zustand";
import { Question } from "@/types/question";

interface QuestionState {
    question: Question | null;
    selectedOptionId: number | null;
    isLoading: boolean;

    fetchQuestion: (questionId: number) => Promise<void>;
    submitAnswer: (questionId: number, selectedOptionId: number) => Promise<void>;
}

const useQuestionStore = create<QuestionState>((set, get) => ({
    question: null,
    selectedOptionId: null,
    isLoading: false,

    fetchQuestion: async (questionId: number) => {
        set({ isLoading: true });

        try {
            const res = await api.get(`/question/${questionId}`);
            set({ question: res.data.data });
        } catch (e) {
            console.log("Error fetching question:", e);
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
        } catch (e) {
            console.log("Error submitting answer:", e);
        }
    },
}));

export default useQuestionStore;
