import useQuestionStore from "@/store/useQuestion";
import { HeaderBackIconButton } from "@/components/util/headerBackIconButton";
import { Stack } from "expo-router";

const QuestionLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[questionId]"
                options={{
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerLeft: () => <HeaderBackIconButton iconName="angle-left" />,
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
        </Stack>
    );
};

export default QuestionLayout;
