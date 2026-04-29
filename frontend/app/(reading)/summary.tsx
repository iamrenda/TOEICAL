import React from "react";
import Variables from "@/constants/Variables";
import useQuizStore from "@/store/useQuizStore";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { Footer, CustomButton, CircularProgressChart } from "@/components";
import { FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const SummaryScreen = () => {
    const {
        quizQuestions: questions,
        correctAnswersCount,
        times,
        quizAnswers,
        setExplanationQuestionIndex,
        reset,
    } = useQuizStore();

    const onGoHome = () => {
        router.back();
        reset();
    };

    const scorePercentage = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 0;
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;

    const onQuestionPress = (index: number) => {
        setExplanationQuestionIndex(index);
        router.push("/(reading)/explanation");
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Animated Circular Progress */}
                <View style={styles.scoreCircleContainer}>
                    <CircularProgressChart
                        percentage={scorePercentage}
                        size={200}
                        strokeWidth={10}
                        animationDuration={1500}
                    />
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <FontAwesome6 name="square-check" size={16} color={Variables.primary600} solid />
                            <Text style={styles.statTitle}>正解数</Text>
                        </View>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>{correctAnswersCount}問</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statHeader}>
                            <FontAwesome6 name="clock" size={16} color={Variables.primary600} />
                            <Text style={styles.statTitle}>平均解答時間</Text>
                        </View>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>{averageTime.toFixed(0)}秒</Text>
                        </View>
                    </View>
                </View>

                {/* Check Answers Section */}
                <View style={styles.answersSection}>
                    <Text style={styles.sectionTitle}>解答の確認</Text>
                    <View style={styles.questionList}>
                        {questions.map((q, index) => {
                            const isCorrect = quizAnswers[index] === q.correct_option_id;
                            return (
                                <TouchableOpacity
                                    key={q.id}
                                    style={styles.questionCard}
                                    onPress={() => onQuestionPress(index)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.questionNumberContainer,
                                            isCorrect ? styles.numberCorrect : styles.numberIncorrect,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.questionNumberText,
                                                isCorrect ? styles.textCorrect : styles.textIncorrect,
                                            ]}
                                        >
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View style={styles.questionInfo}>
                                        <Text style={styles.questionTextPreview} numberOfLines={1}>
                                            {q.question}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.resultText,
                                                isCorrect ? styles.textCorrect : styles.textIncorrect,
                                            ]}
                                        >
                                            {isCorrect ? "正解！" : "不正解"}
                                        </Text>
                                    </View>
                                    <FontAwesome6 name="angle-right" size={16} color={Variables.gray400} />
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <Footer>
                <CustomButton text="ホームに戻る" variant="primary" onPress={onGoHome} flex={1} />
            </Footer>
        </SafeAreaView>
    );
};

export default SummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Variables.white,
        paddingHorizontal: 24,
        paddingTop: 48,
    },
    scrollContent: {},
    scoreCircleContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    statsContainer: {
        flexDirection: "row",
        paddingVertical: 24,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: Variables.white,
        borderRadius: Variables.borderRadiusSecondary,
        padding: 16,
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        borderWidth: 1,
        borderColor: Variables.border,
    },
    statHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    },
    statTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: Variables.gray500,
    },
    statValueContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 8,
    },
    statValue: {
        fontSize: 28,
        fontWeight: "700",
        color: Variables.textPrimary,
    },
    answersSection: {
        paddingTop: 24,
        paddingBottom: 48,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Variables.textPrimary,
        marginBottom: 16,
    },
    questionList: {
        gap: 12,
    },
    questionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Variables.white,
        padding: 16,
        borderRadius: Variables.borderRadiusSecondary,
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        borderWidth: 1,
        borderColor: Variables.border,
    },
    questionNumberContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    numberCorrect: {
        backgroundColor: "#E6F6EC", // very light green
    },
    numberIncorrect: {
        backgroundColor: "#FDEAEB", // very light red
    },
    questionNumberText: {
        fontSize: 18,
        fontWeight: "800",
    },
    textCorrect: {
        color: Variables.green600,
    },
    textIncorrect: {
        color: Variables.red500,
    },
    questionInfo: {
        flex: 1,
        marginRight: 16,
    },
    questionTextPreview: {
        fontSize: 16,
        color: "#111827",
        fontWeight: "600",
        marginBottom: 6,
    },
    resultText: {
        fontSize: 13,
        fontWeight: "700",
    },
});
