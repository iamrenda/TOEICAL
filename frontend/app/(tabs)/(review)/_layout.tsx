import { Stack } from "expo-router";
import Variables from "@/constants/Variables";

const ReviewLayout = () => {
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
                    headerShadowVisible: false,
                }}
            />
        </Stack>
    );
};

export default ReviewLayout;
