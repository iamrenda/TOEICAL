import { StyleSheet, Text } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";

interface Props {
    id: number;
    style?: object;
}

const QuestionIdLabel = ({ id, style }: Props) => {
    return <Text style={[styles.questionIdText, style]}>問題ID: {id.toString().padStart(4, "0")}</Text>;
};

export { QuestionIdLabel };

const styles = StyleSheet.create({
    questionIdText: {
        color: Variables.primary600,
        backgroundColor: Variables.primary100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Variables.primary600,
        borderRadius: Variables.borderRadiusPrimary,
        fontSize: 12,
        fontWeight: "600",
    },
});
