import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { getItemAsync } from "expo-secure-store";

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
                type: "NETWORK",
                code: 0,
                message: "Network error. Please check your connection.",
            } as ApiError);
        }

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getItemAsync("refreshToken");

                if (refreshToken) {
                    const res = await axios.post(`${Links.BASE_URL_AUTH}/token`, {
                        token: refreshToken,
                    });

                    const newAccessToken = res.data.accessToken;

                    useAuthStore.setState({ accessToken: newAccessToken });

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (e) {
                useAuthStore.setState({ accessToken: null, isLoggedIn: false });
                return Promise.reject({
                    type: "AUTH",
                    code: 401,
                    message: "Session expired. Please log in again.",
                } as ApiError);
            }
        }

        return Promise.reject({
            type: "SERVER",
            code: error.response?.status || 0,
            message: error.response?.data?.message || error.message || "An unexpected error occurred.",
        });
    },
);

export default api;
