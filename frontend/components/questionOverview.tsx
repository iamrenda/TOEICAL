import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Overview } from "@/types/question";
import Variables from "@/constants/Variables";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Link } from "expo-router";
import getRelativeTime from "@/util/getRelativeTime";

interface Props {
    overview: Overview;
}

const QuestionOverview = ({ overview }: Props) => {
    const { id, question, is_starred, was_last_attempt_correct, last_answered_at } = overview;

    const diffInMs = last_answered_at !== null ? Date.now() - new Date(last_answered_at).getTime() : 0;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    const statusColor =
        was_last_attempt_correct === null
            ? Variables.textTertiary
            : was_last_attempt_correct
              ? Variables.green600
              : Variables.red600;

    const statusLabel = was_last_attempt_correct === null ? "未回答" : was_last_attempt_correct ? "正解" : "不正解";

    return (
        <Link href={`/question/${id.toString()}`} asChild>
            <Pressable>
                <View style={styles.container}>
                    <View style={styles.questionIdContainer}>
                        <Text style={styles.questionIdText}>問題ID: {id.toString().padStart(4, "0")}</Text>
                        <FontAwesome
                            name={is_starred ? "star" : "star-o"}
                            color={is_starred ? Variables.yellow500 : Variables.textTertiary}
                            size={20}
                        />
                    </View>
                    <Text style={styles.questionText} numberOfLines={2}>
                        {question}
                    </Text>

                    <View style={styles.questionStatusContainer}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                        <Text style={styles.answeredAtText}>
                            {last_answered_at ? `(${getRelativeTime(diffInDays)})` : ""}
                        </Text>
                        <Pressable style={styles.reviewButtonContainer}>
                            <Text style={styles.reviewButtonText}>復習する</Text>
                            <FontAwesome6 name="angle-right" size={16} color={Variables.primary600} />
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
};

export default QuestionOverview;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: Variables.borderRadiusPrimary,
        borderWidth: 1,
        borderColor: Variables.border,
        marginBottom: 12,
    },

    questionIdContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
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
    questionText: {
        color: Variables.textSecondary,
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 16,
    },

    questionStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Variables.border,
        paddingTop: 12,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "500",
        paddingRight: 12,
    },
    answeredAtText: {
        fontSize: 12,
        color: Variables.textTertiary,
    },
    reviewButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
        gap: 4,
    },
    reviewButtonText: {
        color: Variables.primary600,
        fontSize: 14,
        fontWeight: "500",
    },
});
