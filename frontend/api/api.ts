import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { getItemAsync } from "expo-secure-store";

const api = axios.create({
    baseURL: Links.BASE_URL_API,
    headers: { "Content-Type": "application/json" },
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
            } catch (refreshError) {
                useAuthStore.setState({ accessToken: null, isLoggedIn: false });
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
