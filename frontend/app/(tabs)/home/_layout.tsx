import { Stack, useRouter } from "expo-router";
import Variables from "@/constants/Variables";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useSettingsStore from "@/store/useSettingsStore";

const HomeLayout = () => {
    const router = useRouter();
    const { setTabsVisibility } = useSettingsStore();

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "TOEICAL",
                    headerTitleStyle: {
                        color: Variables.primary600,
                        fontWeight: "800",
                    },
                }}
            />
            <Stack.Screen
                name="soloQuizSettings"
                options={{
                    title: "ソロクイズ設定",
                    headerTitleStyle: {
                        color: Variables.primary600,
                        fontWeight: "800",
                    },
                    animation: "slide_from_bottom",
                    headerLeft: () => (
                        <Pressable
                            onPress={() => {
                                router.back();
                                setTabsVisibility(false);
                            }}
                        >
                            <Ionicons name="close" size={24} color="black" />
                        </Pressable>
                    ),
                }}
            />
        </Stack>
    );
};

export default HomeLayout;
