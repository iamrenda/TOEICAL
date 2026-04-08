import useSettingsStore from "@/store/useSettingsStore";
import { HeaderBackIconButton } from "@/components/";
import { router, Stack } from "expo-router";

const ReadingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="soloQuizSettingsModal"
                options={{
                    title: "",
                    headerShadowVisible: false,
                    animation: "slide_from_bottom",
                    headerLeft: () => (
                        <HeaderBackIconButton
                            iconName="angle-left"
                            onPress={() => {
                                router.back();
                                useSettingsStore.setState({ isVisible: true });
                            }}
                        />
                    ),
                }}
            />
        </Stack>
    );
};

export default ReadingLayout;
