import Links from "@/constants/Links";
import useUserStore from "./useUserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import handleError from "@/util/handleError";
import api from "@/api/api";
import { create } from "zustand";
import { ErrorType } from "@/types/ErrorType";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";
import { UserStorageData, UserTokenData } from "@/types/User";
import { StoreResult } from "@/types/StoreResult";
import { ApiSuccessResponse } from "@/types/ApiResponse";

interface UserLoginResponse {
    username: string;
    accessToken: string;
    refreshToken: string;
}

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    accessTokenExpiresAt: number | null;
    refreshTokenExpiresAt: number | null;

    isLoading: boolean;
    isLoggedIn: boolean;

    setLoading: (isLoading: boolean) => void;

    refreshAccessToken: () => Promise<StoreResult>;
    getTokenData: () => Promise<StoreResult<UserTokenData>>;
    setTokenData: (tokenData: UserTokenData) => void;
    persistTokenData: (tokenData: UserTokenData) => Promise<StoreResult>;
    clearSession: () => Promise<void>;

    initialize: () => Promise<StoreResult>;
    signUp: (username: string, email: string, password: string) => Promise<StoreResult>;
    login: (email: string, password: string) => Promise<StoreResult>;
    logout: () => Promise<void>;
}

const ACCESS_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hr
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

const isTokenExpired = (expiryTime: number) => Date.now() > expiryTime;

const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    refreshToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,

    isLoading: true,
    isLoggedIn: false,

    setLoading: (isLoading) => set({ isLoading }),

    refreshAccessToken: async () => {
        try {
            const current = get();
            if (!current.refreshToken) {
                return { success: false, errorType: ErrorType.AUTH, errorMessage: "認証に失敗しました。" };
            }

            const res = await api.post<ApiSuccessResponse<{ accessToken: string }>>(`${Links.BASE_URL_AUTH}/token`, {
                token: current.refreshToken,
            });

            const { accessToken } = res.data.data;
            const tokenData: UserTokenData = {
                accessToken,
                refreshToken: current.refreshToken!,
                accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
                refreshTokenExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRY,
            };
            current.setTokenData(tokenData);
            await current.persistTokenData(tokenData);

            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        }
    },

    getTokenData: async () => {
        try {
            const rawTokenData = await getItemAsync("token-data");

            if (!rawTokenData) {
                return { success: false, errorType: ErrorType.AUTH, errorMessage: "認証に失敗しました。" };
            }

            return { success: true, data: JSON.parse(rawTokenData) };
        } catch (e) {
            return handleError(e);
        }
    },

    setTokenData: (tokenData: UserTokenData) => {
        set({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken,
            accessTokenExpiresAt: tokenData.accessTokenExpiresAt,
            refreshTokenExpiresAt: tokenData.refreshTokenExpiresAt,
        });
    },

    // update token data in secure storage
    persistTokenData: async (tokenData: UserTokenData) => {
        try {
            await setItemAsync("token-data", JSON.stringify(tokenData));
            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        }
    },

    clearSession: async () => {
        try {
            await Promise.all([AsyncStorage.removeItem("user-data"), deleteItemAsync("token-data")]);
        } catch (e) {
            console.error("Failed to clear session", e);
        } finally {
            useUserStore.setState({ username: "" });
            set({
                accessToken: null,
                refreshToken: null,
                accessTokenExpiresAt: null,
                refreshTokenExpiresAt: null,
                isLoggedIn: false,
            });
        }
    },

    initialize: async () => {
        try {
            const current = get();
            const res = await current.getTokenData();

            if (!res.success) {
                set({ isLoggedIn: false, isLoading: false });
                return res;
            }

            const tokenData = res.data;
            current.setTokenData(tokenData);

            const { accessTokenExpiresAt, refreshTokenExpiresAt } = tokenData;

            // Check if refresh token is expired
            if (isTokenExpired(refreshTokenExpiresAt)) {
                await current.clearSession();
                return { success: false, errorType: ErrorType.AUTH };
            }

            // If access token is expired, try to refresh it
            if (isTokenExpired(accessTokenExpiresAt)) {
                const res = await current.refreshAccessToken();

                if (!res.success) {
                    await current.clearSession();
                    return { success: false, errorType: ErrorType.AUTH };
                }
            }

            // Load user data
            const storageData = await AsyncStorage.getItem("user-data");
            if (storageData) {
                const userData: UserStorageData = JSON.parse(storageData);
                useUserStore.setState({ username: userData.username });
            }

            set({ isLoggedIn: true });
            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    signUp: async (username, email, password) => {
        set({ isLoading: true });

        try {
            await api.post<ApiSuccessResponse<void>>(`${Links.BASE_URL_AUTH}/signup`, {
                username,
                email,
                password,
            });

            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });

        try {
            const current = get();
            const res = await api.post<ApiSuccessResponse<UserLoginResponse>>(`${Links.BASE_URL_AUTH}/login`, {
                email,
                password,
            });

            if (res.data.status !== "success") {
                set({ isLoggedIn: false, accessToken: null });
                return { success: false, errorType: ErrorType.AUTH };
            }

            const { username, accessToken, refreshToken } = res.data.data;

            const tokenData: UserTokenData = {
                accessToken,
                refreshToken,
                accessTokenExpiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
                refreshTokenExpiresAt: Date.now() + REFRESH_TOKEN_EXPIRY,
            };
            current.setTokenData(tokenData);
            await current.persistTokenData(tokenData);

            const userData: UserStorageData = { username };
            await AsyncStorage.setItem("user-data", JSON.stringify(userData));
            useUserStore.setState({ username });

            set({ isLoggedIn: true });
            return { success: true, data: null };
        } catch (e) {
            return handleError(e);
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });

        try {
            await api.post<ApiSuccessResponse<void>>(`${Links.BASE_URL_AUTH}/logout`, {
                token: get().refreshToken,
            });
        } catch (e) {
            console.log("Failed to logout.", e);
        } finally {
            await get().clearSession();
            set({ isLoading: false });
        }
    },
}));

export default useAuthStore;
