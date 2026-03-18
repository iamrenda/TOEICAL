import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Option, Question } from "@/types/question";
import Variables from "@/constants/Variables";
import Footer from "@/components/footer";
import CustomButtonPrimary from "@/components/buttonPrimary";

const optionLetter = ["A", "B", "C", "D"];

const QuestionScreen = () => {
    const [selectedOptionId, setSelectedOptionId] = React.useState<number | null>(null);
    const { questionId: id } = useLocalSearchParams();

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
                translated_option: "(A) Because of（前置詞：～の理由で）",
            },
            {
                option: "If",
                option_id: 12,
                translated_option: "(D) If（もし～ならば）",
            },
            {
                option: "Immediately",
                option_id: 11,
                translated_option: "(C) Immediately（副詞；すぐに）",
            },
            {
                option: "In case of",
                option_id: 10,
                translated_option: "(B) In case of（前置詞；～の場合に備えて）",
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

    return (
        <View style={styles.container}>
            <Text style={styles.questionIdText}>問題ID: {id.toString().padStart(4, "0")}</Text>
            <Text style={styles.questionText}>{question.question}</Text>

            {question.options.map((option, index) => (
                <OptionComponent
                    key={option.option_id}
                    option={option}
                    letter={optionLetter[index]}
                    isSelected={selectedOptionId === option.option_id}
                    onPress={() => setSelectedOptionId(option.option_id)}
                />
            ))}

            <Footer>
                <CustomButtonPrimary text="決定！" isSelected={!!selectedOptionId} onPress={() => {}} />
            </Footer>
        </View>
    );
};

const OptionComponent = ({
    option,
    letter,
    isSelected,
    onPress,
}: {
    option: Option;
    letter: string;
    isSelected: boolean;
    onPress: () => void;
}) => {
    return (
        <Pressable style={[styles.optionContainer, isSelected && styles.selectedOptionContainer]} onPress={onPress}>
            <Text style={[styles.optionLetter, isSelected && styles.selectedOptionLetter]}>{letter}</Text>
            <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{option.option}</Text>
        </Pressable>
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

    optionContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: Variables.borderRadiusPrimary,
        borderWidth: 1,
        borderColor: Variables.border,
        marginBottom: 12,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
    },
    optionLetter: {
        fontSize: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: "center",
        fontWeight: "600",
        borderWidth: 1,
        borderRadius: Variables.borderRadiusPrimary,
        borderColor: Variables.border,
    },
    optionText: {
        fontSize: 16,
        fontWeight: "500",
    },

    // selected
    selectedOptionContainer: {
        backgroundColor: Variables.primary100,
        borderColor: Variables.primary600,
        borderWidth: 2,
    },
    selectedOptionLetter: {
        color: Variables.white,
        borderColor: Variables.primary600,
        backgroundColor: Variables.primary600,
    },
    selectedOptionText: {
        color: Variables.primary600,
        fontWeight: "700",
    },
});
