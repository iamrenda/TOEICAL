import React from "react";
import Variables from "@/constants/Variables";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import useWritingStore from "@/store/useWritingStore";
import { useHeaderHeight } from "@react-navigation/elements";

const rawData = [
    {
        id: 8,
        topic: "Write about your favorite season and what you like to do during it.",
        description:
            "Pick the time of year you enjoy most and describe how the weather feels and what activities you enjoy.",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 70,
        tags: ["daily-life", "reflection"],
    },
    {
        id: 9,
        topic: "The impact of remote work on productivity.",
        description:
            "Discuss whether remote work increases or decreases overall employee productivity, giving examples.",
        difficulty: "medium",
        limit_time_minutes: 15,
        recommended_word_count: 150,
        tags: ["business", "work"],
    },
    {
        id: 10,
        topic: "Urbanization and environmental protection.",
        description:
            "Discuss the priority between rapid urban development and nature conservation with specific examples.",
        difficulty: "hard",
        limit_time_minutes: 30,
        recommended_word_count: 300,
        tags: ["social", "environment"],
    },
];

const EssayWritingScreen = () => {
    const { id } = useLocalSearchParams();
    const [text, setText] = React.useState("");
    const [timeLeft, setTimeLeft] = React.useState(0);
    const navigation = useNavigation();
    const setStoreTimeLeft = useWritingStore((s) => s.setTimeLeft);

    const essayData = rawData.find((item) => item.id === Number(id)) || rawData[0];

    React.useEffect(() => {
        navigation.getParent()?.setOptions({ gestureEnabled: false });
    }, []);

    React.useEffect(() => {
        setTimeLeft(essayData.limit_time_minutes * 60);
    }, [essayData]);

    // sync local time with shared store
    React.useEffect(() => {
        setStoreTimeLeft(timeLeft);
    }, [timeLeft]);

    React.useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <View style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={useHeaderHeight()}
            >
                <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.promptContainer}>
                        <Text style={styles.promptTitle}>{essayData.topic}</Text>
                        <Text style={styles.promptDescription}>{essayData.description}</Text>
                    </View>

                    <View style={styles.writingArea}>
                        <TextInput
                            style={styles.textInput}
                            multiline
                            placeholder="Start writing your essay here..."
                            placeholderTextColor={Variables.gray300}
                            value={text}
                            onChangeText={setText}
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>
                <View style={styles.toolbar}>
                    <View style={styles.timerContainer}>
                        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                    </View>
                    <Text style={styles.wordCountText}>
                        <Text style={styles.currentWordCount}>{wordCount}</Text> / {essayData.recommended_word_count}{" "}
                        words
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EssayWritingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Variables.background,
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Variables.primary100,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    timerText: {
        fontSize: 14,
        fontWeight: "bold",
        color: Variables.primary800,
        fontVariant: ["tabular-nums"],
    },
    content: {
        flex: 1,
    },
    promptContainer: {
        padding: 20,
        backgroundColor: Variables.white,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: Variables.gray100,
    },
    promptTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.textPrimary,
        marginBottom: 8,
        lineHeight: 26,
    },
    promptDescription: {
        fontSize: 14,
        color: Variables.textSecondary,
        lineHeight: 22,
    },
    writingArea: {
        flex: 1,
        backgroundColor: Variables.white,
        minHeight: 400,
    },
    textInput: {
        flex: 1,
        padding: 20,
        fontSize: 16,
        lineHeight: 24,
        color: Variables.textPrimary,
    },
    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Variables.white,
        borderTopWidth: 1,
        borderTopColor: Variables.gray100,
    },
    wordCountText: {
        fontSize: 14,
        color: Variables.gray500,
        fontWeight: "600",
    },
    currentWordCount: {
        color: Variables.primary600,
    },
});
