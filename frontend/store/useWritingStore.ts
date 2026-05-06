import api from "@/api/api";
import handleError from "@/util/handleError";
import { AxiosResponse } from "@/types/Axios";
import { WritingDifficulty, WritingTags, WritingTopic } from "@/types/Writing";
import { ZustandResponse } from "@/types/Zustand";
import { create } from "zustand";

interface WritingState {
    isLoading: boolean;

    selectedTopic: WritingTopic | null;
    setSelectedTopic: (topicId: number | null) => void;

    allTopics: WritingTopic[] | null;
    fetchTopics: (difficulty: WritingDifficulty | null, tags: WritingTags | null) => Promise<ZustandResponse>;

    userEssay: string;
    setUserEssay: (text: string) => void;

    onFinish: () => void;

    reset: () => void;
}

const useWritingStore = create<WritingState>((set, get) => ({
    isLoading: false,

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

    onFinish: () => {
        // After submittion
    },

    reset: () => {
        set({
            selectedTopic: null,
            allTopics: null,
        });
    },
}));

export default useWritingStore;
