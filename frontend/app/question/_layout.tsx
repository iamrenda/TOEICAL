import { FontAwesome6 } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

const HeaderBackButton = () => {
    return (
        <Link href=".." asChild>
            <Pressable>
                <FontAwesome6 name="angle-left" size={24} color="black" />
            </Pressable>
        </Link>
    );
};

const QuestionLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[questionId]"
                options={{
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerLeft: () => <HeaderBackButton />,
                }}
            />
        </Stack>
    );
};

export default QuestionLayout;
