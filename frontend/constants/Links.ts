import Constants from "expo-constants";

const devHost = Constants.expoConfig?.hostUri?.split(":")[0];
const host = process.env.EXPO_PUBLIC_API_HOST || devHost;

if (!host) {
    throw new Error("EXPO_PUBLIC_API_HOST is not defined in the environment variables.");
}

const port = process.env.EXPO_PUBLIC_PORT || "3000";
const baseUrl = `http://${host}:${port}`;

export default {
    BASE_URL_API: `${baseUrl}/api`,
    BASE_URL_AUTH: `${baseUrl}/auth`,
};
