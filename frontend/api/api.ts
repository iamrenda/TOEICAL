import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getItemAsync } from "expo-secure-store";
import normalizeError from "@/util/normalizeError";
import handleErrorSideEffects from "@/util/handleErrorSideEffects";

const TIMEOUT_IN_MS = 5000;

const api = axios.create({
    baseURL: Links.BASE_URL_API,
    headers: { "Content-Type": "application/json" },
    timeout: TIMEOUT_IN_MS,
});

api.interceptors.request.use(async (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

// 401 Response handler
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Network error (no response received)
        if (!error.response) {
            const errorResponse = normalizeError(error);
            await handleErrorSideEffects(errorResponse);
            return Promise.reject(errorResponse);
        }

        // Handle Unauthorized - Attempt token refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getItemAsync("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                // Refresh the token
                const res = await axios.post<AxiosResponse<{ accessToken: string }>>(`${Links.BASE_URL_AUTH}/token`, {
                    token: refreshToken,
                });

                const newAccessToken = res.data.data?.accessToken;

                if (!newAccessToken) {
                    throw new Error("No access token in refresh response");
                }

                useAuthStore.setState({ accessToken: newAccessToken });

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Token refresh failed, normalize and handle the error
                const errorResponse = normalizeError(refreshError);
                await handleErrorSideEffects(errorResponse);
                return Promise.reject(errorResponse);
            }
        }

        const errorResponse = normalizeError(error);
        await handleErrorSideEffects(errorResponse);
        return Promise.reject(errorResponse);
    },
);

export default api;
