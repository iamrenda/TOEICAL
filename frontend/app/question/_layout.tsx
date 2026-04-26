import useQuestionStore from "@/store/useQuestion";
import { HeaderBackIconButton } from "@/components";
import { Stack } from "expo-router";

const QuestionLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[questionId]"
                options={{
                    headerTitle: "",
                    headerShadowVisible: false,
                }}
            />
            <Stack.Screen
                name="explanation"
                options={{
                    presentation: "modal",
                    headerTitle: "解説",
                    headerLeft: () => (
                        <HeaderBackIconButton
                            iconName="xmark"
                            onPress={() => useQuestionStore.setState({ selectedOptionId: null })}
                        />
                    ),
                }}
            />
            <Stack.Screen name="summary" options={{ headerShown: false }} />
        </Stack>
    );
};

export default QuestionLayout;
