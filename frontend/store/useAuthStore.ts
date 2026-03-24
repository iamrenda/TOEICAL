import Links from "@/constants/Links";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";
import { router } from "expo-router";
import showAlert from "@/util/alert";
import { UserLoginResponse } from "@/types/auth";
import { LoginErrorType } from "@/types/error";
// import { setItemAsync, deleteItemAsync } from "expo-secure-store";

const loginErrorMessages: Record<number, LoginErrorType> = {
    401: LoginErrorType.INVALID_CREDENTIALS,
    429: LoginErrorType.TOO_MANY_ATTEMPTS,
    500: LoginErrorType.SERVER_ERROR,
};

interface AuthState {
    accessToken: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;

    setLoading: (isLoading: boolean) => void;
    signUp: (username: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<{ success: boolean; errorType: LoginErrorType } | null>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
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

            showAlert("サインアップ成功", "アカウントが作成されました。ログインしてください。");
            router.replace("/login");
        } catch (e) {
            showAlert("サインアップエラー", "サインアップに失敗しました。もう一度お試しください。");
            console.log(e);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });

        try {
            const res = await axios.post<UserLoginResponse>(`${Links.BASE_URL_AUTH}/login`, {
                email,
                password,
            });

            // TODO: Store tokens securely
            const { accessToken, refreshToken } = res.data;
            set({ isLoggedIn: true, accessToken });

            return null; // Success
        } catch (e) {
            if (isAxiosError(e)) {
                const status = e.response?.status;
                const errorType = loginErrorMessages[status || 500];

                return { success: false, errorType };
            }

            return { success: false, errorType: LoginErrorType.NETWORK_ERROR };
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
            set({ isLoggedIn: false, accessToken: null });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
