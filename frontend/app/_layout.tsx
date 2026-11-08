import React from "react";
import useAuthStore from "@/store/useAuthStore";
import { SplashScreen, Stack } from "expo-router";

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
