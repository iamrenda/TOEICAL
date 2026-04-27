import React from "react";
import Variables from "@/constants/Variables";
import useSoloQuizStore from "@/store/useSoloQuizStore";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Footer, CustomButton } from "@/components";
import { FontAwesome6 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const SummaryScreen = () => {
    const { questions, correctAnswersCount, times, resetQuiz } = useSoloQuizStore();
    const router = useRouter();

    const onGoHome = () => {
        resetQuiz();
        router.replace("/(tabs)/(reading)");
    };

    const scorePercentage = questions.length > 0 ? (correctAnswersCount / questions.length) * 100 : 0;
    const averageTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.iconContainer}>
                <FontAwesome6 name="trophy" size={64} color={Variables.primary600} />
            </View>
            <Text style={styles.title}>クイズ終了！</Text>
            <Text style={styles.scoreText}>
                {correctAnswersCount} / {questions.length} 正解
            </Text>
            <Text style={styles.percentageText}>正答率: {scorePercentage.toFixed(0)}%</Text>
            <Text style={styles.timeText}>平均解答時間: {averageTime.toFixed(1)}秒/問</Text>

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
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
        backgroundColor: Variables.white,
    },
    iconContainer: {
        backgroundColor: Variables.primary100,
        padding: 24,
        borderRadius: 100,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: Variables.textPrimary,
        marginBottom: 16,
    },
    scoreText: {
        fontSize: 24,
        fontWeight: "600",
        color: Variables.textPrimary,
        marginBottom: 8,
    },
    percentageText: {
        fontSize: 18,
        color: Variables.textSecondary,
        marginBottom: 8,
    },
    timeText: {
        fontSize: 16,
        color: Variables.textSecondary,
    },
});
