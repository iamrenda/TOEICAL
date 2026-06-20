import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios, { AxiosError } from "axios";
import { ErrorType } from "@/types/Error";
import { ErrorResponse } from "@/types/ErrorResponse";
import normalizeError from "@/util/normalizeError";

// const TIMEOUT_IN_MS = 5000;
const TIMEOUT_IN_MS = 60_000;

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
            return Promise.reject({
                isCustomError: true,
                success: false,
                code: 0,
                errorType: ErrorType.NETWORK,
                error,
            } as ErrorResponse);
        }

        // Handle Unauthorized - Attempt token refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await useAuthStore.getState().refreshAccessToken();

                if (!res.success) {
                    await useAuthStore.getState().logout();
                    return Promise.reject(normalizeError(error));
                }

                const newToken = useAuthStore.getState().accessToken;

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Token refresh failed, normalize and handle the error
                await useAuthStore.getState().logout();
                const errorResponse = normalizeError(refreshError);
                return Promise.reject(errorResponse);
            }
        }

        const errorResponse = normalizeError(error);
        return Promise.reject(errorResponse);
    },
);

export default api;
