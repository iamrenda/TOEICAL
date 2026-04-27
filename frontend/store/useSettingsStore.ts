import { create } from "zustand";

interface SettingsState {
    isVisible: boolean;
}

// will be used when updated to sdk 55
const useSettingsStore = create<SettingsState>((set) => ({
    isVisible: true,
}));

export default useSettingsStore;
