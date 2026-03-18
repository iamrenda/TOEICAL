import { create } from "zustand";

interface SettingsState {
    isTabsHidden: boolean;
    setTabsVisibility: (status: boolean) => void;
}

const useSettingsStore = create<SettingsState>((set) => ({
    isTabsHidden: false,
    setTabsVisibility: (status) => set(() => ({ isTabsHidden: status })),
}));

export default useSettingsStore;
