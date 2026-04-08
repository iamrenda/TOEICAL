import { create } from "zustand";

interface SettingsState {
    isVisible: boolean;
}

const useSettingsStore = create<SettingsState>((set) => ({
    isVisible: true,
}));

export default useSettingsStore;
