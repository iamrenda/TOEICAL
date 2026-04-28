import React from "react";
import Variables from "@/constants/Variables";
import useQuizStore from "@/store/useQuizStore";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Footer, QuestionOption, CustomButton, QuestionIdLabel, HeaderBackIconButton } from "@/components";
import showErrorAlert from "@/util/showErrorAlert";
import { ErrorMessages } from "@/constants/ErrorMessages";

const optionLetter = ["A", "B", "C", "D"];

const QuestionScreen = () => {
    const { questionId } = useLocalSearchParams();
    const {
        isLoading,
        isQuizMode,
        selectedOptionId,
        selectOption,
        fetchQuestion,
        fetchNextQuestion,
        submitAnswer,
        quizQuestions,
        quizCurrentIndex,
        answerQuizQuestion,
        submitQuizAnswer,
        nextQuizQuestion,
        getCurrentQuestion,
        addTime,
    } = useQuizStore();

    const question = getCurrentQuestion();
    const isReady = isQuizMode ? quizQuestions.length > 0 : !isLoading && !!question;

    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [startTime, setStartTime] = React.useState(Date.now());

    const router = useRouter();

    const onSubmit = () => {
        if (!isSubmitted && isQuizMode && questionId && selectedOptionId) {
            const timeTaken = (Date.now() - startTime) / 1000;
            addTime(timeTaken);
        }
        setIsSubmitted(true);

        if (questionId && selectedOptionId) {
            if (isQuizMode && question) {
                const isCorrect = selectedOptionId === question.correct_option_id;
                answerQuizQuestion(isCorrect);
                submitQuizAnswer(Number(questionId), isCorrect);
            } else {
                submitAnswer(Number(questionId), selectedOptionId);
            }
        }
    };

    const onNextQuestion = async () => {
        setIsSubmitted(false);

        if (isQuizMode) {
            if (quizCurrentIndex + 1 < quizQuestions.length) {
                nextQuizQuestion();
                const nextId = quizQuestions[quizCurrentIndex + 1].id;
                router.replace(`/(reading)/${nextId}`);
            } else {
                router.replace("/(reading)/summary");
            }
            return;
        }

        const res = await fetchNextQuestion(Number(questionId));

        if (res.success) {
            const nextQuestionId = useQuizStore.getState().currentQuestion?.id;
            if (nextQuestionId) {
                router.replace(`/(reading)/${nextQuestionId}`);
            }

            return;
        }

        const { errorType } = res;

        if (errorType) {
            showErrorAlert({ message: ErrorMessages[errorType] });
        }

        router.replace("/(reading)/");
    };

    React.useEffect(() => {
        if (isQuizMode) {
            setStartTime(Date.now());
        } else if (questionId) {
            fetchQuestion(Number(questionId));
        }
    }, [questionId, isQuizMode]);

    if (!isReady || !question) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    }

    const progress = isQuizMode && quizQuestions.length > 0 ? ((quizCurrentIndex + 1) / quizQuestions.length) * 100 : 0;

    return (
        <View style={styles.container}>
            {isQuizMode ? (
                <Stack.Screen
                    options={{
                        headerTitle: () => (
                            <View style={{ alignItems: "center", gap: 8, width: "95%" }}>
                                <View
                                    style={{
                                        width: "100%",
                                        height: 8,
                                        backgroundColor: Variables.gray200,
                                        borderRadius: 4,
                                        overflow: "hidden",
                                    }}
                                >
                                    <View
                                        style={{
                                            height: "100%",
                                            backgroundColor: Variables.primary600,
                                            width: `${progress}%`,
                                        }}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: Variables.gray600,
                                        alignSelf: "flex-end",
                                    }}
                                >
                                    {`問題 ${quizCurrentIndex + 1} / ${quizQuestions.length}`}
                                </Text>
                            </View>
                        ),
                        headerBackVisible: false,
                        headerTitleAlign: "center",
                    }}
                />
            ) : (
                <Stack.Screen
                    options={{
                        headerTitle: "",
                        headerShadowVisible: false,
                        headerLeft: () => <HeaderBackIconButton iconName="angle-left" />,
                    }}
                />
            )}
            <QuestionIdLabel id={Number(questionId)} style={{ alignSelf: "flex-start", marginBottom: 12 }} />
            <Text style={styles.questionText}>{question.question}</Text>

            {question.options
                .sort((a, b) => a.option_id - b.option_id)
                .map((option, index) => (
                    <QuestionOption
                        key={option.option_id}
                        isCorrect={option.option_id === question.correct_option_id}
                        option={option}
                        letter={optionLetter[index]}
                        isSelected={selectedOptionId === option.option_id}
                        onPress={() => !isSubmitted && selectOption(option.option_id)}
                        isSubmitted={isSubmitted}
                    />
                ))}

            <Footer>
                {isSubmitted ? (
                    <View style={styles.submittedContainer}>
                        <CustomButton
                            text="解説"
                            variant="secondary"
                            onPress={() => router.push("/(reading)/explanation")}
                            flex={3}
                        />
                        <CustomButton text="次の問題" variant="primary" onPress={onNextQuestion} flex={7} />
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
