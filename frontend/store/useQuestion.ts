import { create } from "zustand";
import { Question } from "@/types/question";
import api from "@/api/api";

interface QuestionState {
    question: Question | null;
    isLoading: boolean;

    fetchQuestion: (questionId: number) => Promise<void>;
}

const useQuestionStore = create<QuestionState>((set) => ({
    question: null,
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
}));

export default useQuestionStore;
