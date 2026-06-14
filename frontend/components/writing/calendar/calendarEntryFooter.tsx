import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import { SELECTED_ENTRY } from "@/data/writingCalendarData";

const CalendarEntryFooter = () => {
    const entry = SELECTED_ENTRY;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateLabel}>{entry.dateLabel}</Text>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>AI スコア</Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreValue}>{entry.score}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.title}>{entry.title}</Text>
            <Text style={styles.snippet} numberOfLines={2}>
                {entry.snippet}
            </Text>

            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>エッセイとフィードバックを見る</Text>
                <FontAwesome6 name="arrow-right" size={16} color={Variables.white} />
            </Pressable>
        </View>
    );
};

export { CalendarEntryFooter };

const styles = StyleSheet.create({
    container: {
        marginTop: 18,
        backgroundColor: Variables.gray50,
        borderWidth: 1,
        borderColor: Variables.gray100,
        borderRadius: 22,
        padding: 18,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    dateLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: Variables.textSecondary,
    },
    scoreRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: Variables.textSecondary,
    },
    scoreBadge: {
        backgroundColor: Variables.primary600,
        borderRadius: 999,
        paddingHorizontal: 11,
        paddingVertical: 3,
    },
    scoreValue: {
        color: Variables.white,
        fontWeight: "800",
        fontSize: 14,
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: Variables.textPrimary,
        lineHeight: 23,
        marginBottom: 8,
    },
    snippet: {
        fontSize: 14,
        color: Variables.textSecondary,
        lineHeight: 21,
        marginBottom: 14,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: Variables.primary600,
        borderRadius: 14,
        paddingVertical: 14,
    },
    buttonText: {
        color: Variables.white,
        fontSize: 16,
        fontWeight: "700",
    },
});
