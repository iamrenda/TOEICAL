import { HeaderBackIconButton } from "@/components";
import { Stack } from "expo-router";

const ReadingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="reading"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="soloQuizSettingsModal"
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

export default ReadingLayout;
