import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Overview } from "@/types/question";
import Colors from "@/constants/Colors";
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
            ? Colors.textTertiary
            : was_last_attempt_correct
              ? Colors.green600
              : Colors.red600;

    const statusLabel = was_last_attempt_correct === null ? "未回答" : was_last_attempt_correct ? "正解" : "不正解";

    return (
        <View style={styles.container}>
            <View style={styles.questionIdContainer}>
                <Text style={styles.questionIdText}>問題ID: {id.toString().padStart(4, "0")}</Text>
                <FontAwesome
                    name={is_starred ? "star" : "star-o"}
                    color={is_starred ? Colors.yellow500 : Colors.textTertiary}
                    size={20}
                />
            </View>
            <Text style={styles.questionText} numberOfLines={2}>
                {question}
            </Text>

            <View style={styles.questionStatusContainer}>
                <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
                <Text style={styles.answeredAtText}>{last_answered_at ? `(${getRelativeTime(diffInDays)})` : ""}</Text>
                <Link href={`/home/${id.toString()}`} asChild>
                    <Pressable style={styles.reviewButtonContainer}>
                        <Text style={styles.reviewButtonText}>詳細</Text>
                        <FontAwesome6 name="angle-right" size={16} color={Colors.primary600} />
                    </Pressable>
                </Link>
            </View>
        </View>
    );
};

export default QuestionOverview;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 12,
    },

    questionIdContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    questionIdText: {
        color: Colors.primary600,
        backgroundColor: Colors.primary100,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: Colors.primary600,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: "600",
    },
    questionText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 16,
    },

    questionStatusContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: 12,
    },
    statusText: {
        fontSize: 14,
        fontWeight: "500",
        paddingRight: 12,
    },
    answeredAtText: {
        fontSize: 12,
        color: Colors.textTertiary,
    },
    reviewButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
        gap: 4,
    },
    reviewButtonText: {
        color: Colors.primary600,
        fontSize: 14,
        fontWeight: "500",
    },
});
