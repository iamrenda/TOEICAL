import { Stack } from "expo-router";
import Colors from "@/constants/Colors";

const HomeLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "TOEICAL",
                    headerTitleStyle: {
                        color: Colors.primary600,
                        fontWeight: "800",
                    },
                }}
            />
            <Stack.Screen
                name="refresh"
                options={{
                    title: "REFRESH MODE",
                    headerBackTitle: "戻る",
                    headerTitleStyle: {
                        color: Colors.primary600,
                        fontWeight: "800",
                    },
                }}
            />
            <Stack.Screen
                name="[questionId]"
                options={{
                    title: "TOEICAL",
                    headerTitleStyle: {
                        color: Colors.primary600,
                        fontWeight: "800",
                    },
                    headerBackTitle: "戻る",
                }}
            />
        </Stack>
    );
};

export default HomeLayout;
