import useAuthStore from "@/store/useAuthStore";
import { Stack } from "expo-router";

const RootLayout = () => {
    const { isLoggedIn } = useAuthStore();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="(auth)" />
            </Stack.Protected>
            <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>
        </Stack>
    );
};

export default RootLayout;
