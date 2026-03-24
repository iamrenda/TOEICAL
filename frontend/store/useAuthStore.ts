import Links from "@/constants/Links";
import axios from "axios";
import { Alert } from "react-native";
import { create } from "zustand";
import { router } from "expo-router";
// import { setItemAsync, deleteItemAsync } from "expo-secure-store";

interface AuthState {
    isLoading: boolean;
    isLoggedIn: boolean;

    setLoading: (isLoading: boolean) => void;
    signUp: (username: string, email: string, password: string) => Promise<void>;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isLoading: false,
    isLoggedIn: false,

    setLoading: (isLoading) => set({ isLoading }),

    signUp: async (username, email, password) => {
        set({ isLoading: true });

        try {
            await axios.post(`${Links.BASE_URL_AUTH}/signup`, {
                username,
                email,
                password,
            });

            Alert.alert("サインアップ成功", "アカウントが作成されました。ログインしてください。", [{ text: "閉じる" }]);
            router.push("/(auth)/login");
        } catch (e) {
            Alert.alert("サインアップエラー", "サインアップに失敗しました。もう一度お試しください。", [
                { text: "閉じる" },
            ]);
            console.log(e);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (token) => {
        set({ isLoading: true });
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // In a real app, you would call your login API here
            // const response = await axios.post("/login", { token });
            set({ isLoggedIn: true });
        } catch (error) {
            // console.error("Login error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // In a real app, you would call your logout API here
            // const response = await axios.post("/logout");
            set({ isLoggedIn: false });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
