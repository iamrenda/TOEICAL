import api from "@/api/api";
import handleError from "@/util/handleError";
import useQuestionOverviewStore from "./useQuestionOverviewStore";
import { create } from "zustand";
import { ApiSuccessResponse } from "@/types/ApiResponse";
import { StoreResult } from "@/types/StoreResult";
import { QuestionListResponse, QuestionResponse } from "@toeical/shared";

interface QuizState {
    // Single Question Mode
    currentQuestion: QuestionResponse | null;
    selectedOptionId: number | null;

    // Quiz Mode
    quizQuestions: QuestionResponse[];
    quizCurrentIndex: number;
    correctAnswersCount: number;
    times: number[];
    quizAnswers: number[];
    explanationQuestionIndex: number | null;

    // Shared
    isLoading: boolean;
    isQuizMode: boolean;

    fetchQuestion: (questionId: number) => Promise<StoreResult>;
    fetchNextQuestion: (currentQuestionId: number) => Promise<StoreResult>;

    // submit answer for **single** question mode
    submitAnswer: (questionId: number, selectedOptionId: number) => Promise<StoreResult>;
    selectOption: (optionId: number) => void;
    fetchQuizQuestions: (type: string, count: number) => Promise<StoreResult>;

    // marks current question as answered and increment score if correct
    answerQuizQuestion: (isCorrect: boolean, selectedOptionId: number) => void;

    // sets the index of the question to view in the explanation modal from the summary
    setExplanationQuestionIndex: (index: number | null) => void;

    addTime: (time: number) => void;
    nextQuizQuestion: () => void;
    submitQuizAnswer: (questionId: number, isCorrect: boolean) => Promise<void>;

    reset: () => void;
    getCurrentQuestion: () => QuestionResponse | null;
    isCurrentAnswerCorrect: () => boolean;
}

const useQuizStore = create<QuizState>((set, get) => ({
    currentQuestion: null,
    selectedOptionId: null,
    quizQuestions: [],
    quizCurrentIndex: 0,
    correctAnswersCount: 0,
    times: [],
    quizAnswers: [],
    explanationQuestionIndex: null,
    isLoading: false,
    isQuizMode: false,

    fetchQuestion: async (questionId: number) => {
        set({ isLoading: true });

        try {
            const res = await api.get<ApiSuccessResponse<QuestionResponse>>(`/question/${questionId}`);

            set({
                currentQuestion: res.data.data,
                selectedOptionId: null,
                isQuizMode: false, // Explicitly single-question mode
            });
            return { success: true, data: null };
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
            const res = await api.get<ApiSuccessResponse<QuestionResponse>>(
                `/question/${currentQuestionId}/next?sortBy=id.asc&starred=${isStarredFilter}`,
            );

            set({
                currentQuestion: res.data.data,
                selectedOptionId: null,
                isQuizMode: false,
            });

            return { success: true, data: null };
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
            await api.post<ApiSuccessResponse<void>>(`/question/history/${questionId}`, {
                wasCorrect,
            });
            return { success: true, data: null };
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
            quizAnswers: [],
            explanationQuestionIndex: null,
            selectedOptionId: null,
            isQuizMode: true,
        });

        try {
            const res = await api.get<ApiSuccessResponse<QuestionListResponse>>(
                `/question/random?type=${type}&count=${count}`,
            );

            set({
                quizQuestions: res.data.data,
                currentQuestion: res.data.data[0],
            });

            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    answerQuizQuestion: (isCorrect: boolean, selectedOptionId: number) => {
        set((state) => ({
            correctAnswersCount: isCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount,
            quizAnswers: [...state.quizAnswers, selectedOptionId],
        }));
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
            console.log("Error saving quiz answer history.", e);
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
            quizAnswers: [],
            explanationQuestionIndex: null,
            isLoading: false,
            isQuizMode: false,
        });
    },

    setExplanationQuestionIndex: (index: number | null) => {
        set({ explanationQuestionIndex: index });
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
