import api from "@/api/api";
import handleError from "@/util/handleError";
import { AxiosResponse } from "@/types/Axios";
import {
    WritingDifficulty,
    WritingEssayAnalysisInput,
    WritingEssayAnalysisOutput,
    WritingTags,
    WritingTopic,
} from "@/types/Writing";
import { ZustandResponse } from "@/types/Zustand";
import { create } from "zustand";
import { ErrorType } from "@/types/Error";

interface WritingState {
    isLoading: boolean;
    essayAnalysisResult: WritingEssayAnalysisOutput | null;
    setEssayAnalysisResult: (result: WritingEssayAnalysisOutput | null) => void;

    selectedDifficulty: WritingDifficulty;
    setSelectedDifficulty: (difficulty: WritingDifficulty) => void;
    selectedTags: WritingTags;
    setSelectedTags: (tags: WritingTags) => void;

    selectedTopic: WritingTopic | null;
    setSelectedTopic: (topicId: number | null) => void;

    allTopics: WritingTopic[] | null;
    fetchTopics: (difficulty: WritingDifficulty | null, tags: WritingTags | null) => Promise<ZustandResponse>;

    userEssay: string;
    setUserEssay: (text: string) => void;

    submitEssay: (essay: string, timeTaken: number, wordCount: number) => Promise<ZustandResponse>;

    reset: () => void;
}

const useWritingStore = create<WritingState>((set, get) => ({
    isLoading: false,
    essayAnalysisResult: null,
    setEssayAnalysisResult: (result) => set({ essayAnalysisResult: result }),

    selectedDifficulty: WritingDifficulty.ALL,
    setSelectedDifficulty: (difficulty) => {
        set({ selectedDifficulty: difficulty });
        get().fetchTopics(difficulty, get().selectedTags);
    },
    selectedTags: WritingTags.ALL,
    setSelectedTags: (tags) => {
        set({ selectedTags: tags });
        get().fetchTopics(get().selectedDifficulty, tags);
    },

    selectedTopic: null,
    setSelectedTopic: (id) => {
        if (!id) {
            set({ selectedTopic: null });
            return;
        }

        const topic = get().allTopics?.find((t) => t.id === id) || null;
        set({ selectedTopic: topic });
    },

    allTopics: null,
    fetchTopics: async (difficulty: WritingDifficulty | null, tags: WritingTags | null) => {
        set({ isLoading: true });

        try {
            const res = await api.get<AxiosResponse<WritingTopic[]>>(
                `writing/topics?difficulty=${difficulty}&tag=${tags}`,
            );

            if (res.data.status !== "success") {
                return { success: false, errorType: ErrorType.SERVER };
            }

            set({ allTopics: res.data.data });

            return { success: true };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    userEssay: "",
    setUserEssay: (text) => set({ userEssay: text }),

    submitEssay: async (essay: string, timeTaken: number, wordCount: number) => {
        set({ isLoading: true });

        const { selectedTopic } = get();
        const { topic, id, description, difficulty, limit_time_minutes } = selectedTopic || {};

        const body: WritingEssayAnalysisInput = {
            topic: topic || "",
            topicId: id || 0,
            description: description || "",
            essay,
            difficulty: difficulty || WritingDifficulty.ALL,
            timeLimit: limit_time_minutes || 0,
            timeTaken: timeTaken,
            wordCount: wordCount,
        };

        try {
            const res = await api.post<AxiosResponse<WritingEssayAnalysisOutput>>("writing", body);

            set({ essayAnalysisResult: res.data.data });

            return { success: true, data: res.data.data };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => {
        set({
            selectedTopic: null,
            allTopics: null,
            essayAnalysisResult: null,
        });
    },
}));

export default useWritingStore;
