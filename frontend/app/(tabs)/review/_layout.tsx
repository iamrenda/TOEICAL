import { Stack } from "expo-router";
import Variables from "@/constants/Variables";

const HomeLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "REFRESH MODE",
                    headerTitleStyle: {
                        color: Variables.primary600,
                        fontWeight: "800",
                    },
                }}
            />
            <Stack.Screen
                name="[questionId]"
                options={{
                    headerBackTitle: "戻る",
                }}
            />
        </Stack>
    );
};

export default HomeLayout;
