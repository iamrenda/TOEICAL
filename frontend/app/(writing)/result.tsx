import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Variables from "@/constants/Variables";
import { CircularProgressChart, CustomButton, Footer } from "@/components";
import { router } from "expo-router";
import useWritingStore from "@/store/useWritingStore";

type Rubric = {
    title: string;
    score: number;
};

const RubricDescription = ({ metric }: { metric: Rubric }) => {
    return (
        <View style={styles.metricItem}>
            <View style={styles.metricItemHeader}>
                <Text style={styles.metricItemTitle}>{metric.title}</Text>
                <Text style={styles.metricItemScoreRow}>
                    <Text style={styles.metricItemScore}>{metric.score}</Text>
                    <Text style={styles.metricItemTotal}>/100</Text>
                </Text>
            </View>
            <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${metric.score}%` }]} />
            </View>
        </View>
    );
};

const ResultScreen = () => {
    const { essayAnalysisResult } = useWritingStore();

    if (!essayAnalysisResult) {
        return (
            <View style={styles.safeArea}>
                <View style={[styles.card, { margin: 20 }]}>
                    <Text style={{ fontSize: 16, color: Variables.textSecondary }}>
                        結果の読み込みに失敗しました。もう一度試してください。
                    </Text>
                </View>
            </View>
        );
    }

    const { structure_score, topic_relevancy_score, grammar_score, vocabulary_score, overall_score, feedback_summary } =
        essayAnalysisResult;

    const rubrics = [
        {
            title: "文法 (Grammar)",
            score: grammar_score,
        },
        {
            title: "関連性 (Relevancy)",
            score: topic_relevancy_score,
        },
        {
            title: "構成 (Structure)",
            score: structure_score,
        },
        {
            title: "語彙 (Vocab Usage)",
            score: vocabulary_score,
        },
    ];

    return (
        <View style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <CircularProgressChart percentage={overall_score} color={Variables.primary600}>
                        <Text style={{ fontSize: 36, fontWeight: "800", color: Variables.textPrimary }}>
                            {overall_score}%
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: Variables.gray400 }}>総合評価</Text>
                    </CircularProgressChart>
                </View>

                <View style={[styles.card, styles.metricsCard]}>
                    <View style={styles.metricsHeader}>
                        <View style={styles.metricsTitleRow}>
                            <View style={styles.metricsIndicator} />
                            <Text style={styles.metricsTitle}>評価詳細</Text>
                        </View>
                    </View>

                    {rubrics.map((metric, index) => (
                        <RubricDescription key={index} metric={metric} />
                    ))}
                </View>

                {/* AI Feedback Card */}
                <View style={styles.feedbackCard}>
                    <View style={styles.feedbackHeaderRow}>
                        <Text style={styles.sparkleIcon}>✨</Text>
                        <Text style={styles.feedbackTitle}>AI 総合フィードバック</Text>
                    </View>

                    <Text style={styles.feedbackParagraph}>{feedback_summary}</Text>
                </View>
            </ScrollView>
            <Footer style={{ paddingVertical: 12, paddingHorizontal: 24, gap: 12 }}>
                <CustomButton text="戻る" variant="secondary" onPress={() => router.back()} flex={3} />
                <CustomButton
                    text="模範解答を見る"
                    variant="primary"
                    onPress={() => {
                        router.push("/(writing)/aiEssayModal");
                    }}
                    flex={7}
                />
            </Footer>
        </View>
    );
};

export default ResultScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Variables.background,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: Variables.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    metricsCard: {
        padding: 24,
    },
    metricsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 32,
    },
    metricsTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    metricsIndicator: {
        width: 4,
        height: 20,
        backgroundColor: Variables.primary600,
        borderRadius: 2,
    },
    metricsTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.textPrimary,
    },
    metricItem: {
        marginBottom: 24,
    },
    metricItemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 8,
    },
    metricItemTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: Variables.textPrimary,
    },
    metricItemScoreRow: {
        alignItems: "baseline",
    },
    metricItemScore: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.primary600,
    },
    metricItemTotal: {
        fontSize: 12,
        fontWeight: "bold",
        color: Variables.gray400,
    },
    progressBarBackground: {
        height: 4,
        backgroundColor: Variables.gray150,
        borderRadius: 2,
        marginBottom: 12,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: Variables.primary600,
        borderRadius: 2,
    },
    metricFeedback: {
        fontSize: 12,
        color: Variables.textSecondary,
        lineHeight: 18,
    },
    feedbackCard: {
        backgroundColor: "#0D1425",
        borderRadius: 16,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    feedbackHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    sparkleIcon: {
        fontSize: 20,
    },
    feedbackTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.white,
    },
    feedbackParagraph: {
        fontSize: 14,
        color: "#E2E8F0", // Light gray for good contrast
        lineHeight: 24,
        marginBottom: 20,
    },
    feedbackDivider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        marginVertical: 24,
    },
    generatedEssayParagraph: {
        fontSize: 14,
        color: "#E2E8F0",
        lineHeight: 24,
        marginBottom: 12,
    },
});
