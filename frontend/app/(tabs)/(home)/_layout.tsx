import { Stack } from "expo-router";
import { HeaderBackIconButton } from "@/components";
import useSettingsStore from "@/store/useSettingsStore";

const HomeLayout = () => {
    const { setTabsVisibility } = useSettingsStore();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="soloQuizSettings"
                options={{
                    title: "",
                    animation: "slide_from_bottom",
                    headerLeft: () => (
                        <HeaderBackIconButton onPress={() => setTabsVisibility(true)} iconName="xmark" />
                    ),
                    headerShadowVisible: false,
                }}
            />
        </Stack>
    );
};

export default HomeLayout;
