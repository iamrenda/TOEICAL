import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Question } from "@/types/question";
import QuestionIdLabel from "@/components/question/questionIdLabel";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import ExplanationText from "@/components/question/explanationText";

const ExplanationModal = () => {
    const question: Question = {
        id: 3,
        question:
            "——– you experience any problems with the building’s equipment, you should contact the property manager.",
        correct_option_id: 12,
        translated_question: "建物の設備に何らかの不具合があった場合、不動産管理人に連絡してください。",
        type_description:
            "選択肢を見ると、前置詞句、前置詞句、副詞、接続詞の【接続詞・前置詞・副詞問題】であることがわかります。",
        is_starred: true,
        options: [
            {
                option: "Because of",
                option_id: 9,
                translated_option: "Because of（前置詞：～の理由で）",
            },
            {
                option: "If",
                option_id: 12,
                translated_option: "If（もし～ならば）",
            },
            {
                option: "Immediately",
                option_id: 11,
                translated_option: "Immediately（副詞；すぐに）",
            },
            {
                option: "In case of",
                option_id: 10,
                translated_option: "In case of（前置詞；～の場合に備えて）",
            },
        ],
        detailed_descriptions: [
            '——– <strong><span style="color:#cf2e2e" class="color">you experience</span></strong> any problems with the building’s equipment, <strong><span style="color:#cf2e2e" class="color">you should contact </span></strong>the property manager.',
            "この問題のように、主語と動詞を確認して接続詞が入ることがわかり、選択肢の中に接続詞が１つだけならば文全体の意味を考える必要はありません。接続詞の候補が２つ以上ある場合は、全体の意味をとる必要があります。",
            "この問題は文の主語・動詞の確認のみで判断できるので全文の意味を考える必要のない<strong>「部分読み問題」</strong>となります。<strong></strong>",
            "空所の後ろの形を見ます。you experienceで主語+動詞の形で、カンマ以降もyou should contactで主語+動詞の形になっています。したがって空所には接続詞が入ることがわかります。選択肢の中で接続詞は(D) If（もし～ならば）だけなので(D)を選びます。",
        ],
        translated_vocabs: ["equipment（機器、装置）", "property（不動産、物件）"],
    };

    const correctOption = question.options.find((o) => o.option_id === question.correct_option_id);
    const wasCorrect = false; // DUMMY

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
                        Conclude
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
