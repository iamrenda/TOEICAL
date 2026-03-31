import Links from "@/constants/Links";
import useUserStore from "./useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";
import { UserLoginResponse } from "@/types/auth";
import { ErrorType } from "@/types/error";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";
import { UserStorageData } from "@/types/user";
import { ZustandResponse } from "@/types/zustand";
import handleError from "@/util/handleError";

interface AuthState {
    accessToken: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;

    setLoading: (isLoading: boolean) => void;
    initialize: () => Promise<ZustandResponse>;
    signUp: (username: string, email: string, password: string) => Promise<ZustandResponse>;
    login: (email: string, password: string) => Promise<ZustandResponse>;
    logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isLoading: true,
    isLoggedIn: false,

    setLoading: (isLoading) => set({ isLoading }),

    initialize: async () => {
        try {
            const accessToken = await getItemAsync("accessToken");

            if (accessToken) {
                const storageData = await AsyncStorage.getItem("user-data");

                if (storageData) {
                    const userData: UserStorageData = JSON.parse(storageData);
                    useUserStore.setState({ username: userData.username });
                }

                set({ accessToken, isLoggedIn: true });
                return { success: true };
            }

            set({ isLoggedIn: false, accessToken: null });
            return { success: false, errorType: ErrorType.VALIDATION };
        } catch (e) {
            return handleError(e);
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
            return handleError(e);
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

            await setItemAsync("accessToken", accessToken);
            await setItemAsync("refreshToken", refreshToken);

            const userData: UserStorageData = { username };

            await AsyncStorage.setItem("user-data", JSON.stringify(userData));

            useUserStore.setState({ username });
            set({ isLoggedIn: true, accessToken });

            return { success: true };
        } catch (e) {
            return handleError(e);
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
            console.error("Logout error:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
