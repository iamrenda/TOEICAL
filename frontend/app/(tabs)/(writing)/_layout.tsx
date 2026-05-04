import { HeaderBackIconButton } from "@/components";
import { router, Stack } from "expo-router";
import { Alert } from "react-native";

const WritingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="writing"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="writingTopicCardModal"
                options={{
                    presentation: "modal",
                    headerTitle: "",
                    animation: "slide_from_bottom",
                    headerShadowVisible: false,
                    headerLeft: () => <HeaderBackIconButton iconName="xmark" />,
                }}
            />
        </Stack>
    );
};

export default WritingLayout;
