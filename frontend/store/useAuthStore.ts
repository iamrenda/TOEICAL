import Links from "@/constants/Links";
import useUserStore from "./useUserStore";
import axios, { isAxiosError } from "axios";
import { create } from "zustand";
import { UserLoginResponse } from "@/types/auth";
import { LoginErrorType, SignUpErrorType } from "@/types/error";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";

interface SignUpResponse {
    success: boolean;
    errorType?: SignUpErrorType;
}

interface LoginResponse {
    success: boolean;
    errorType?: LoginErrorType;
}

interface AuthState {
    accessToken: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;

    setLoading: (isLoading: boolean) => void;
    initialize: () => Promise<void>;
    signUp: (username: string, email: string, password: string) => Promise<SignUpResponse>;
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<void>;
}

const loginErrorMessages: Record<number, LoginErrorType> = {
    401: LoginErrorType.INVALID_CREDENTIALS,
    429: LoginErrorType.TOO_MANY_ATTEMPTS,
    500: LoginErrorType.SERVER_ERROR,
};

const signUpErrorMessages: Record<number, SignUpErrorType> = {
    409: SignUpErrorType.USER_ALREADY_EXISTS,
    500: SignUpErrorType.SERVER_ERROR,
};

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isLoading: true,
    isLoggedIn: false,

    setLoading: (isLoading) => set({ isLoading }),

    initialize: async () => {
        try {
            const accessToken = await getItemAsync("accessToken");

            if (accessToken) {
                set({ accessToken, isLoggedIn: true });
            }
        } catch (e) {
            console.log("Error initializing auth store:", e);
        } finally {
            set({ isLoading: false });
        }
    },

    signUp: async (username, email, password) => {
        set({ isLoading: true });

        try {
            await axios.post(`${Links.BASE_URL_AUTH}/signup`, {
                username,
                email,
                password,
            });

            return { success: true };
        } catch (e) {
            if (isAxiosError(e)) {
                const status = e.response?.status;
                const errorType = signUpErrorMessages[status || 500];

                return { success: false, errorType };
            }

            return { success: false, errorType: SignUpErrorType.NETWORK_ERROR };
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

            const { username, accessToken, refreshToken } = res.data;

            set({ isLoggedIn: true, accessToken });
            await setItemAsync("accessToken", accessToken);
            await setItemAsync("refreshToken", refreshToken);
            useUserStore.setState({ username });

            return { success: true };
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
            set({ isLoggedIn: false, accessToken: null });
            await deleteItemAsync("accessToken");
            await deleteItemAsync("refreshToken");
        } catch (error) {
            // TODO: Logout error handling
            console.error("Logout error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
