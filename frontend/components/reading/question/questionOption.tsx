import React from "react";
import Variables from "@/constants/Variables";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Option } from "@/types/questions";

const QuestionOption = ({
    option,
    letter,
    isSelected,
    isCorrect,
    onPress,
    isSubmitted,
}: {
    option: Option;
    letter: string;
    isCorrect: boolean;
    isSelected: boolean;
    isSubmitted: boolean;
    onPress: () => void;
}) => {
    const isIncorrect = isSelected && !isCorrect;

    const stylesArray = {
        container: [
            styles.optionContainer,
            isSelected && styles.selectedOptionContainer,
            isSubmitted && !isSelected && styles.unselectedOptionContainer,
            isSubmitted && isSubmitted && isCorrect && styles.correctOptionContainer,
            isSubmitted && isIncorrect && styles.incorrectOptionContainer,
        ],
        letter: [
            styles.optionLetter,
            isSelected && styles.selectedOptionLetter,
            isSubmitted && !isSelected && styles.unselectedOptionLetter,
            isSubmitted && isCorrect && styles.correctOptionLetter,
            isSubmitted && isIncorrect && styles.incorrectOptionLetter,
        ],
        text: [
            styles.optionText,
            isSelected && styles.selectedOptionText,
            isSubmitted && !isSelected && styles.unselectedOptionText,
            isSubmitted && isCorrect && styles.correctOptionText,
            isSubmitted && isIncorrect && styles.incorrectOptionText,
        ],
        translatedOptionText: [
            styles.translatedOptionText,
            isSubmitted && isCorrect && styles.translatedOptionTextCorrect,
            isSubmitted && isIncorrect && styles.translatedOptionTextIncorrect,
        ],
    };

    return (
        <Pressable style={stylesArray.container} onPress={onPress} disabled={isSubmitted}>
            <Text style={stylesArray.letter}>{letter}</Text>
            <View>
                <Text style={stylesArray.text}>{option.option}</Text>
                {isSubmitted && <Text style={stylesArray.translatedOptionText}>{option.translated_option}</Text>}
            </View>
        </Pressable>
    );
};

export { QuestionOption };

const styles = StyleSheet.create({
    optionContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: Variables.borderRadiusPrimary,
        borderWidth: 1,
        borderColor: Variables.border,
        marginBottom: 16,
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

    // unselected option
    unselectedOptionContainer: {
        backgroundColor: Variables.white,
        borderColor: Variables.border,
        borderWidth: 1,
    },
    unselectedOptionLetter: {
        color: Variables.gray400,
        borderColor: Variables.border,
        backgroundColor: Variables.white,
    },
    unselectedOptionText: {
        color: Variables.gray400,
        fontWeight: "400",
    },

    // correct option
    correctOptionContainer: {
        borderColor: Variables.green600,
        backgroundColor: Variables.green600,
        borderWidth: 2,
        boxShadow: "0px 4px 6px rgba(38, 186, 82, 0.3)",
    },
    correctOptionLetter: {
        color: Variables.white,
        borderColor: Variables.white,
        backgroundColor: Variables.green600,
    },
    correctOptionText: {
        color: Variables.white,
        fontWeight: "700",
    },

    // incorrect option
    incorrectOptionContainer: {
        borderColor: Variables.red600,
        backgroundColor: Variables.red600,
        borderWidth: 2,
        boxShadow: "0px 4px 6px rgba(220, 20, 60, 0.3)",
    },
    incorrectOptionLetter: {
        color: Variables.white,
        borderColor: Variables.white,
        backgroundColor: Variables.red600,
    },
    incorrectOptionText: {
        color: Variables.white,
        fontWeight: "700",
    },

    // translated option
    translatedOptionText: {
        color: Variables.gray400,
        paddingTop: 4,
        fontSize: 14,
        fontStyle: "italic",
    },
    translatedOptionTextCorrect: {
        color: Variables.white,
    },
    translatedOptionTextIncorrect: {
        color: Variables.white,
    },
});
