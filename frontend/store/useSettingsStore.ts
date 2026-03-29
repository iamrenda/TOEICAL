import { create } from "zustand";

interface SettingsState {
    isVisible: boolean;
    setTabsVisibility: (status: boolean) => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
    isVisible: true,
    setTabsVisibility: (status) => set(() => ({ isVisible: status })),
}));

export default useSettingsStore;
