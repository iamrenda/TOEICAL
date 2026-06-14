import { Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { HeaderBackIconButton } from "@/components";

import { router, Stack } from "expo-router";

const WritingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="writing"
                options={{
                    headerTitle: "",
                    headerTransparent: true,
                    headerRight: () => (
                        <Pressable
                            onPress={() => router.push(`/(tabs)/(writing)/writingCalendarModal`)}
                            style={{ justifyContent: "center", alignItems: "center", width: 40, height: 40 }}
                        >
                            <FontAwesome6 name="calendar" size={24} />
                        </Pressable>
                    ),
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
            <Stack.Screen
                name="writingCalendarModal"
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
