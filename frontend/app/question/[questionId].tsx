import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Question } from "@/types/question";
import Variables from "@/constants/Variables";
import Footer from "@/components/footer";
import OptionComponent from "@/components/question/option";
import CustomButton from "@/components/util/customButton";
import QuestionIdLabel from "@/components/question/questionIdLabel";
import useQuestionStore from "@/store/useQuestion";

const optionLetter = ["A", "B", "C", "D"];

const QuestionScreen = () => {
    const { questionId } = useLocalSearchParams();
    const { question, fetchQuestion, isLoading } = useQuestionStore();

    const [selectedOptionId, setSelectedOptionId] = React.useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const router = useRouter();

    const onSubmit = () => {
        setIsSubmitted(true);
    };

    React.useEffect(() => {
        if (questionId) {
            fetchQuestion(Number(questionId));
        }
    }, [questionId]);

    if (isLoading || !question) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    }

    return (
        <View style={styles.container}>
            <QuestionIdLabel id={Number(questionId)} style={{ alignSelf: "flex-start", marginBottom: 12 }} />
            <Text style={styles.questionText}>{question.question}</Text>

            {question.options
                .sort((a, b) => a.option_id - b.option_id)
                .map((option, index) => (
                    <OptionComponent
                        key={option.option_id}
                        isCorrect={option.option_id === question.correct_option_id}
                        option={option}
                        letter={optionLetter[index]}
                        isSelected={selectedOptionId === option.option_id}
                        onPress={() => setSelectedOptionId(option.option_id)}
                        isSubmitted={isSubmitted}
                    />
                ))}

            <Footer>
                {isSubmitted ? (
                    <View style={styles.submittedContainer}>
                        <CustomButton
                            text="解説"
                            variant="secondary"
                            onPress={() => router.push("/question/explanation")}
                            flex={3}
                        />
                        <CustomButton text="次の問題" variant="primary" onPress={() => {}} flex={7} />
                    </View>
                ) : (
                    <CustomButton
                        text="決定！"
                        variant="primary"
                        onPress={onSubmit}
                        isSelected={!!selectedOptionId}
                        isDisabled={!selectedOptionId}
                        flex={1}
                    />
                )}
            </Footer>
        </View>
    );
};

export default QuestionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 24,
        paddingTop: 24,
        backgroundColor: Variables.white,
    },
    questionIdText: {
        alignSelf: "flex-start",
        color: Variables.primary600,
        backgroundColor: Variables.primary100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Variables.primary600,
        borderRadius: Variables.borderRadiusPrimary,
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 12,
    },
    questionText: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 36,
        lineHeight: 28,
    },

    submittedContainer: {
        flexDirection: "row",
        gap: 12,
    },
});
