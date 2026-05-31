import { HeaderBackIconButton } from "@/components";
import { router, Stack } from "expo-router";
import { Text, Pressable, StyleSheet, Alert } from "react-native";
import Variables from "@/constants/Variables";

const WritingLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="essayWriting" options={{}} />
            <Stack.Screen
                name="loading"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="aiEssayModal"
                options={{
                    presentation: "modal",
                    headerTitle: "",
                    animation: "slide_from_bottom",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: "#0D1425" },
                    headerLeft: () => <HeaderBackIconButton iconName="xmark" iconColor="white" />,
                }}
            />
            <Stack.Screen
                name="result"
                options={{
                    headerShadowVisible: false,
                    headerTitle: "",
                    headerLeft: () => <HeaderBackIconButton iconName="xmark" onPress={() => router.back()} />,
                }}
            />
        </Stack>
    );
};

export default WritingLayout;
