import useAuthStore from "@/store/useAuthStore";
import { SplashScreen, Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
    const { isLoggedIn, isLoading, initialize } = useAuthStore();

    React.useEffect(() => {
        initialize();
    }, []);

    React.useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    // Not render anything until we know the auth status
    if (isLoading) {
        return null;
    }

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
