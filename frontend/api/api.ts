import Links from "@/constants/Links";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";
import { getItemAsync } from "expo-secure-store";

const api = axios.create({
    baseURL: `${Links.BASE_URL_API}`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    async (e) => {
        const status = e.response?.status ?? 500;

        if (status === 401) {
            const refreshToken = await getItemAsync("refreshToken");

            if (refreshToken) {
                try {
                    const res = await axios.post(`${Links.BASE_URL_API}/auth/token`, { token: refreshToken });
                    const newAccessToken = res.data.accessToken;

                    useAuthStore.setState({ accessToken: newAccessToken });

                    return axios(e.config);
                } catch (refreshError) {
                    useAuthStore.setState({ accessToken: null, isLoggedIn: false });
                    return Promise.reject(refreshError);
                }
            } else {
                useAuthStore.setState({ accessToken: null, isLoggedIn: false });
            }
        }

        return Promise.reject(e);
    },
);

export default api;
