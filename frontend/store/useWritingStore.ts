import { create } from "zustand";

interface WritingState {
    timeLeft: number;
    setTimeLeft: (t: number) => void;
    onFinish: (() => void) | null;
    setOnFinish: (fn: (() => void) | null) => void;
}

const useWritingStore = create<WritingState>((set) => ({
    timeLeft: 0,
    setTimeLeft: (t: number) => set({ timeLeft: t }),
    onFinish: null,
    setOnFinish: (fn) => set({ onFinish: fn }),
}));

export default useWritingStore;
