import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Variables from "@/constants/Variables";
import { CircularProgressChart, CustomButton, Footer } from "@/components";
import { router } from "expo-router";

const resultData = {
    overallScore: 82,
    metrics: [
        {
            title: "文法 (Grammar)",
            score: 78,
            feedback: "一貫した時制の使用が必要ですが、基本構造は良好です。",
        },
        {
            title: "関連性 (Relevancy)",
            score: 92,
            feedback: "設問に対して非常に的確な回答がなされています。",
        },
        {
            title: "構成 (Structure)",
            score: 85,
            feedback: "序論、本論、結論の流れが明確に構築されています。",
        },
        {
            title: "語彙 (Vocab Usage)",
            score: 74,
            feedback: "より学術的で具体的な単語の選択肢を検討してください。",
        },
    ],
    overallFeedback: [
        "今回のエッセイは、技術の影響という複雑なテーマに対し、論理的で分かりやすい構成で書かれています。特に導入部から結論に至るまでのパラグラフの役割が明確で、読者が筆者の主張を追いやすい内容でした。",
        "改善点としては、時制と三単現のsといった基本的な文法ミスをゼロにすること、そして「smartphone」や「communicate」といった一般的な語彙に加え、より学術的な「digital infrastructure」や「interpersonal synergy」といった表現を取り入れることで、さらなるハイスコアが期待できます。",
    ],
    aiGeneratedEssay: [
        "In recent years, technology has significantly changed the way people communicate in daily life.",
        "On one hand, digital tools such as messaging apps and video calls help families and friends stay connected across long distances. These tools also allow students and workers to collaborate more efficiently.",
        "On the other hand, excessive reliance on smartphones can reduce face-to-face interaction and weaken social skills. Some people spend more time online than in real conversations.",
        "In my opinion, technology is beneficial when used in moderation. People should take advantage of digital communication while also making time for in-person relationships.",
    ],
    estimatedScore: "Band 7.5",
    aiAccuracy: "99.2%",
};

const ResultScreen = () => {
    return (
        <View style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <CircularProgressChart percentage={resultData.overallScore} color={Variables.primary600}>
                        <Text style={{ fontSize: 36, fontWeight: "800", color: Variables.textPrimary }}>
                            {resultData.overallScore}%
                        </Text>
                        <Text style={{ fontSize: 16, fontWeight: "700", color: Variables.gray400 }}>総合評価</Text>
                    </CircularProgressChart>
                </View>

                {/* Metric Analysis Card */}
                <View style={[styles.card, styles.metricsCard]}>
                    <View style={styles.metricsHeader}>
                        <View style={styles.metricsTitleRow}>
                            <View style={styles.metricsIndicator} />
                            <Text style={styles.metricsTitle}>評価詳細</Text>
                        </View>
                        <Text style={styles.metricsSubtitle}>METRIC ANALYSIS</Text>
                    </View>

                    {resultData.metrics.map((metric, index) => (
                        <View key={index} style={styles.metricItem}>
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
                            <Text style={styles.metricFeedback}>{metric.feedback}</Text>
                        </View>
                    ))}
                </View>

                {/* AI Feedback Card */}
                <View style={styles.feedbackCard}>
                    <View style={styles.feedbackHeaderRow}>
                        <Text style={styles.sparkleIcon}>✨</Text>
                        <Text style={styles.feedbackTitle}>AI 総合フィードバック</Text>
                    </View>

                    {resultData.overallFeedback.map((paragraph, index) => (
                        <Text key={index} style={styles.feedbackParagraph}>
                            {paragraph}
                        </Text>
                    ))}
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
    metricsSubtitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: Variables.primary800,
        letterSpacing: 1,
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
