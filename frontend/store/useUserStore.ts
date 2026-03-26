import { create } from "zustand";

interface UserStore {
    username: string | null;
}

const useUserStore = create<UserStore>((set) => ({
    username: null,
}));

export default useUserStore;
