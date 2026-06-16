import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import useWritingHistory from "@/store/useWritingHistory";
import { UserWritingHistory, WritingEssayAnalysisOutput } from "@/types/Writing";
import { router } from "expo-router";
import useWritingStore from "@/store/useWritingStore";

const Entry = ({ selectedEntry }: { selectedEntry: UserWritingHistory }) => {
    const dateLabel = new Date(selectedEntry.created_at).toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
    });

    const { setUserEssay, setEssayAnalysisResult } = useWritingStore();

    const handleClick = () => {
        const essayAnalysisResult: WritingEssayAnalysisOutput = {
            structure_score: selectedEntry.structure_score,
            topic_relevancy_score: selectedEntry.topic_relevancy_score,
            grammar_score: selectedEntry.grammar_score,
            vocabulary_score: selectedEntry.vocabulary_score,
            overall_score: selectedEntry.overall_score,
            revised_essay: selectedEntry.writing_content,
            feedback_summary: selectedEntry.feedback_summary,
        };

        setUserEssay(selectedEntry.writing_content);
        setEssayAnalysisResult(essayAnalysisResult);
        router.back();
        router.push("/(writing)/result");
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dateLabel}>{dateLabel}</Text>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>AI スコア</Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.scoreValue}>{selectedEntry.overall_score}</Text>
                    </View>
                </View>
            </View>

            <Text style={styles.title}>{selectedEntry.topic}</Text>
            <Text style={styles.snippet} numberOfLines={2}>
                {selectedEntry.description}
            </Text>

            <Pressable style={styles.button} onPress={handleClick}>
                <Text style={styles.buttonText}>エッセイとフィードバックを見る</Text>
                <FontAwesome6 name="arrow-right" size={16} color={Variables.white} />
            </Pressable>
        </View>
    );
};

const CalendarEntryFooter = () => {
    const { selectedEntries, setSelectedEntries } = useWritingHistory();

    // Initial load
    React.useEffect(() => {
        setSelectedEntries();
    }, []);

    if (!selectedEntries || selectedEntries.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>この日の記録はありません</Text>
            </View>
        );
    }

    return (
        <View style={{ marginBottom: 24 }}>
            {selectedEntries.map((entry) => (
                <Entry key={entry.id} selectedEntry={entry} />
            ))}
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
