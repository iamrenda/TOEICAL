import React from "react";
import Variables from "@/constants/Variables";
import useQuizStore from "@/store/useQuizStore";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { QuestionIdLabel, ExplanationText } from "@/components";

const ExplanationModal = () => {
    const { getCurrentQuestion, selectedOptionId: globalSelectedOptionId, isQuizMode, quizQuestions, explanationQuestionIndex, quizAnswers } = useQuizStore();
    
    let question;
    let selectedOptionId;

    if (explanationQuestionIndex !== null && isQuizMode) {
        question = quizQuestions[explanationQuestionIndex];
        selectedOptionId = quizAnswers[explanationQuestionIndex];
    } else {
        question = getCurrentQuestion();
        selectedOptionId = globalSelectedOptionId;
    }

    if (!question) {
        return null;
    }

    const correctOption = question.options.find((o) => o.option_id === question.correct_option_id);
    const selectedOption = question.options.find((o) => o.option_id === selectedOptionId);
    const wasCorrect = selectedOptionId === question.correct_option_id;

    const joinedDescription = question.detailed_descriptions.join("<br/><br/>");

    return (
        <ScrollView style={styles.container}>
            <View style={styles.questionContainer}>
                <QuestionIdLabel id={question.id} style={{ alignSelf: "flex-start", marginBottom: 8 }} />
                <Text style={styles.questionText}>{question.question}</Text>
            </View>

            <View style={styles.optionContainers}>
                <View style={[styles.optionContainer, styles.correctOptionContainer]}>
                    <Text style={styles.optionLabel}>正解</Text>
                    <Text style={[styles.optionText, styles.correctOptionText]}>{correctOption?.option}</Text>
                </View>
                <View
                    style={[
                        styles.optionContainer,
                        wasCorrect ? styles.correctOptionContainer : styles.incorrectOptionContainer,
                    ]}
                >
                    <Text style={styles.optionLabel}>あなたの解答</Text>
                    <Text
                        style={[styles.optionText, wasCorrect ? styles.correctOptionText : styles.incorrectOptionText]}
                    >
                        {selectedOption ? selectedOption.option : "未選択"}
                    </Text>
                </View>
            </View>

            <View style={styles.explanationHeaderContainer}>
                <FontAwesome6 name="lightbulb" size={20} color={Variables.primary600} />
                <Text style={styles.explanationHeaderText}>解説</Text>
            </View>

            <View style={styles.explanationContainer}>
                <View>
                    <Text style={styles.explanationTitle}>問題の和訳</Text>
                    <Text style={styles.explanationText}>{question.translated_question}</Text>
                </View>
                <View>
                    <Text style={styles.explanationTitle}>問題のタイプ</Text>
                    <Text style={styles.explanationText}>{question.type_description}</Text>
                </View>
                <View>
                    <Text style={styles.explanationTitle}>解説</Text>
                    <ExplanationText htmlContent={joinedDescription} />
                </View>
                <View>
                    <Text style={styles.explanationTitle}>語彙</Text>
                    {question.translated_vocabs.map((vocab, index) => (
                        <Text key={index} style={styles.explanationText}>
                            {vocab}
                        </Text>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default ExplanationModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Variables.background,
        paddingTop: 24,
    },

    questionContainer: {
        backgroundColor: Variables.white,
        padding: 16,
        borderRadius: Variables.borderRadiusPrimary,
        marginBottom: 16,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
    },
    questionText: {
        color: Variables.textPrimary,
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 24,
    },

    optionContainers: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 32,
    },
    optionContainer: {
        flex: 1,
        backgroundColor: Variables.white,
        padding: 16,
        borderRadius: Variables.borderRadiusPrimary,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
    },
    correctOptionContainer: {
        borderLeftColor: Variables.green600,
        borderLeftWidth: 4,
    },
    incorrectOptionContainer: {
        borderLeftColor: Variables.red600,
        borderLeftWidth: 4,
    },
    optionLabel: {
        color: Variables.gray400,
        fontSize: 12,
        marginBottom: 4,
    },
    optionText: {
        color: Variables.textPrimary,
        fontSize: 20,
        fontWeight: "700",
    },
    correctOptionText: {
        color: Variables.green600,
    },
    incorrectOptionText: {
        color: Variables.red600,
    },

    explanationHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    explanationHeaderText: {
        fontSize: 18,
        fontWeight: "600",
    },

    explanationContainer: {
        backgroundColor: Variables.white,
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: Variables.borderRadiusPrimary,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        gap: 28,
        marginBottom: 48,
    },
    explanationTitle: {
        fontSize: 16,
        fontWeight: "600",
        borderLeftColor: Variables.primary600,
        borderLeftWidth: 4,
        paddingLeft: 8,
        marginBottom: 8,
    },
    explanationText: {
        color: Variables.textSecondary,
        fontSize: 16,
        lineHeight: 24,
    },
});
