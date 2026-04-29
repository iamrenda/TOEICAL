import api from "@/api/api";
import handleError from "@/util/handleError";
import useQuestionOverviewStore from "./useQuestionOverviewStore";
import { create } from "zustand";
import { Question } from "@/types/Question";
import { AxiosResponse } from "@/types/Axios";
import { ZustandResponse } from "@/types/Zustand";
import { ErrorType } from "@/types/Error";

interface QuizState {
    // Single Question Mode
    currentQuestion: Question | null;
    selectedOptionId: number | null;

    // Quiz Mode
    quizQuestions: Question[];
    quizCurrentIndex: number;
    correctAnswersCount: number;
    times: number[];

    // Shared
    isLoading: boolean;
    isQuizMode: boolean;

    /**
     * Fetch a single question by ID
     * Used when user picks a question from list
     */
    fetchQuestion: (questionId: number) => Promise<ZustandResponse>;

    /**
     * Fetch next question in sequence (applies filters like starred)
     */
    fetchNextQuestion: (currentQuestionId: number) => Promise<ZustandResponse>;

    /**
     * Submit answer for single question mode
     * Validates against current question's correct_option_id
     */
    submitAnswer: (questionId: number, selectedOptionId: number) => Promise<ZustandResponse>;

    /**
     * Set the selected option (before submission)
     */
    selectOption: (optionId: number) => void;

    /**
     * Initialize a quiz session
     * Fetches all questions and resets progress
     */
    fetchQuizQuestions: (type: string, count: number) => Promise<ZustandResponse>;

    /**
     * Mark current question as answered and increment score if correct
     */
    answerQuizQuestion: (isCorrect: boolean) => void;

    /**
     * Record time spent on current question
     */
    addTime: (time: number) => void;

    /**
     * Move to next question in quiz
     */
    nextQuizQuestion: () => void;

    /**
     * Submit quiz answer to backend and move to next
     */
    submitQuizAnswer: (questionId: number, isCorrect: boolean) => Promise<void>;

    /**
     * Reset all state
     */
    reset: () => void;

    /**
     * Helper: Get current question based on mode
     * Returns currentQuestion in single mode, quizQuestions[quizCurrentIndex] in quiz mode
     */
    getCurrentQuestion: () => Question | null;

    /**
     * Helper: Check if current question is answered correctly
     */
    isCurrentAnswerCorrect: () => boolean;
}

const useQuizStore = create<QuizState>((set, get) => ({
    currentQuestion: null,
    selectedOptionId: null,
    quizQuestions: [],
    quizCurrentIndex: 0,
    correctAnswersCount: 0,
    times: [],
    isLoading: false,
    isQuizMode: false,

    fetchQuestion: async (questionId: number) => {
        set({ isLoading: true });

        try {
            const res = await api.get<AxiosResponse<Question>>(`/question/${questionId}`);
            set({
                currentQuestion: res.data.data,
                selectedOptionId: null,
                isQuizMode: false, // Explicitly single-question mode
            });
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
            const res = await api.get<AxiosResponse<Question>>(
                `/question/${currentQuestionId}/next?sortBy=id.asc&starred=${isStarredFilter}`,
            );
            set({
                currentQuestion: res.data.data,
                selectedOptionId: null,
                isQuizMode: false,
            });

            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    submitAnswer: async (questionId: number, selectedOptionId: number) => {
        const state = get();
        const wasCorrect = selectedOptionId === (state.currentQuestion?.correct_option_id ?? -1);

        try {
            await api.post<AxiosResponse<void>>(`/question/history/${questionId}`, {
                wasCorrect,
            });
            return { success: true };
        } catch (e) {
            return handleError(e);
        }
    },

    selectOption: (optionId: number) => {
        set({ selectedOptionId: optionId });
    },

    fetchQuizQuestions: async (type: string, count: number) => {
        set({
            isLoading: true,
            quizQuestions: [],
            quizCurrentIndex: 0,
            correctAnswersCount: 0,
            times: [],
            selectedOptionId: null,
            isQuizMode: true,
        });

        try {
            const res = await api.get<AxiosResponse<Question[]>>(`/question/random?type=${type}&count=${count}`);

            if (!res.data.data) {
                return { success: false, errorType: ErrorType.SERVER };
            }

            set({
                quizQuestions: res.data.data,
                currentQuestion: res.data.data[0],
            });
            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    answerQuizQuestion: (isCorrect: boolean) => {
        if (isCorrect) {
            set((state) => ({ correctAnswersCount: state.correctAnswersCount + 1 }));
        }
    },

    addTime: (time: number) => {
        set((state) => ({ times: [...state.times, time] }));
    },

    nextQuizQuestion: () => {
        set((state) => {
            const nextIndex = state.quizCurrentIndex + 1;
            const nextQuestion = nextIndex < state.quizQuestions.length ? state.quizQuestions[nextIndex] : null;

            return {
                quizCurrentIndex: nextIndex,
                currentQuestion: nextQuestion,
                selectedOptionId: null,
            };
        });
    },

    submitQuizAnswer: async (questionId: number, isCorrect: boolean) => {
        try {
            await api.post(`/question/history/${questionId}`, { wasCorrect: isCorrect });
        } catch (e) {
            console.log("Error saving quiz answer history", e);
        }
    },

    reset: () => {
        set({
            currentQuestion: null,
            selectedOptionId: null,
            quizQuestions: [],
            quizCurrentIndex: 0,
            correctAnswersCount: 0,
            times: [],
            isLoading: false,
            isQuizMode: false,
        });
    },

    getCurrentQuestion: () => {
        const state = get();
        return state.isQuizMode ? (state.quizQuestions[state.quizCurrentIndex] ?? null) : state.currentQuestion;
    },

    isCurrentAnswerCorrect: () => {
        const state = get();
        const question = state.getCurrentQuestion();
        return state.selectedOptionId === question?.correct_option_id;
    },
}));

export default useQuizStore;
