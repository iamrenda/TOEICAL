import { Stack } from "expo-router";

const ReviewLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
};

export default ReviewLayout;
