import api from "@/api/api";
import { create } from "zustand";
import { Question } from "@/types/Question";
import { AxiosResponse } from "@/types/Axios";
import { ZustandResponse } from "@/types/Zustand";
import handleError from "@/util/handleError";
import { ErrorType } from "@/types/Error";

interface SoloQuizState {
    questions: Question[];
    currentIndex: number;
    correctAnswersCount: number;
    times: number[];
    isLoading: boolean;

    fetchQuizQuestions: (type: string, count: number) => Promise<ZustandResponse>;
    answerQuestion: (isCorrect: boolean) => void;
    addTime: (time: number) => void;
    submitQuizAnswer: (questionId: number, isCorrect: boolean) => Promise<void>;
    nextQuestion: () => void;
    resetQuiz: () => void;
}

const useSoloQuizStore = create<SoloQuizState>((set, get) => ({
    questions: [],
    currentIndex: 0,
    correctAnswersCount: 0,
    times: [],
    isLoading: false,

    fetchQuizQuestions: async (type: string, count: number) => {
        set({ isLoading: true, questions: [], currentIndex: 0, correctAnswersCount: 0, times: [] });

        try {
            const res = await api.get<AxiosResponse<Question[]>>(
                `/question/random?type=${type}&count=${count}`,
            );

            if (!res.data.data) {
                return { success: false, errorType: ErrorType.SERVER };
            }

            set({ questions: res.data.data });
            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    answerQuestion: (isCorrect: boolean) => {
        if (isCorrect) {
            set((state) => ({ correctAnswersCount: state.correctAnswersCount + 1 }));
        }
    },

    addTime: (time: number) => {
        set((state) => ({ times: [...state.times, time] }));
    },

    submitQuizAnswer: async (questionId: number, isCorrect: boolean) => {
        try {
            await api.post(`/question/history/${questionId}`, { wasCorrect: isCorrect });
        } catch (e) {
            console.log("Error saving quiz answer history", e);
        }
    },

    nextQuestion: () => {
        set((state) => ({ currentIndex: state.currentIndex + 1 }));
    },

    resetQuiz: () => {
        set({ questions: [], currentIndex: 0, correctAnswersCount: 0, times: [], isLoading: false });
    },
}));

export default useSoloQuizStore;
