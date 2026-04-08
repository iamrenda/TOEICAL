import { Stack } from "expo-router";

const ReadingLayout = () => {
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

export default ReadingLayout;
