import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { getItemAsync } from "expo-secure-store";
import { router } from "expo-router";
import { ZustandResponse } from "@/types/Zustand";
import { ErrorType } from "@/types/Error";
import { AxiosResponse } from "@/types/Axios";

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
    async (error) => {
        if (!error.response) {
            return Promise.reject({
                success: false,
                errorType: ErrorType.NETWORK,
            } as ZustandResponse);
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getItemAsync("refreshToken");

                if (refreshToken) {
                    const res = await axios.post<AxiosResponse<{ accessToken: string }>>(
                        `${Links.BASE_URL_AUTH}/token`,
                        {
                            token: refreshToken,
                        },
                    );

                    const newAccessToken = res.data.data?.accessToken;

                    if (!newAccessToken) {
                        return Promise.reject({
                            success: false,
                            errorType: ErrorType.AUTH,
                        } as ZustandResponse);
                    }

                    useAuthStore.setState({ accessToken: newAccessToken });

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (e) {
                useAuthStore.setState({ accessToken: null, isLoggedIn: false });
                router.replace("/(auth)/login");

                return Promise.reject({
                    success: false,
                    errorType: ErrorType.AUTH,
                } as ZustandResponse);
            }
        }

        return Promise.reject({
            success: false,
            errorType: ErrorType.SERVER,
        } as ZustandResponse);
    },
);

export default api;
