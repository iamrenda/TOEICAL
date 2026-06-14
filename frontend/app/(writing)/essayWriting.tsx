import React from "react";
import Variables from "@/constants/Variables";
import { useNavigation, Stack, router } from "expo-router";
import { HeaderBackIconButton } from "@/components";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Pressable,
    Alert,
} from "react-native";
import useWritingStore from "@/store/useWritingStore";
import { useHeaderHeight } from "@react-navigation/elements";

const EssayWritingScreen = () => {
    const [text, setText] = React.useState("");
    const [timeLeftSeconds, setTimeLeft] = React.useState(0);
    const [isClockHidden, setIsClockHidden] = React.useState(false);
    const [isClockRunning, setIsClockRunning] = React.useState(true);

    const navigation = useNavigation();
    const { selectedTopic, setUserEssay, submitEssay, reset } = useWritingStore();

    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const userHeaderHeight = useHeaderHeight();

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const onSubmit = async () => {
        setIsClockRunning(false);
        router.replace("/(writing)/loading");
        setUserEssay(text);
        const res = await submitEssay(text, Math.floor(timeLeftSeconds / 60), wordCount);

        if (!res.success) {
            Alert.alert("提出に失敗しました", "もう一度試してください。", [
                { text: "OK", onPress: () => setIsClockRunning(true) },
            ]);
            router.replace("/(writing)/result");
        }

        router.replace("/(writing)/result");
    };

    React.useEffect(() => {
        navigation.getParent()?.setOptions({ gestureEnabled: false });
    }, []);

    React.useEffect(() => {
        if (selectedTopic) {
            setTimeLeft(selectedTopic.limit_time_minutes * 60);
        }
    }, [selectedTopic]);

    React.useEffect(() => {
        if (timeLeftSeconds <= 0 || !isClockRunning) {
            setIsClockRunning(false);
            if (timeLeftSeconds < 0) {
                Alert.alert("時間切れです", "書いてある内容で提出します。", [
                    { text: "OK", onPress: () => onSubmit() },
                ]);
            }
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeftSeconds, isClockRunning]);

    if (!selectedTopic) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <View style={styles.safeArea}>
            <Stack.Screen
                options={{
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <HeaderBackIconButton
                            iconName="xmark"
                            shouldGoBack={false}
                            onPress={() => {
                                setIsClockRunning(false);

                                Alert.alert("ライティングモードを終了しますか？", "書いてある内容は失われます。", [
                                    { text: "閉じる", style: "cancel", onPress: () => setIsClockRunning(true) },
                                    {
                                        text: "終了する",
                                        style: "destructive",
                                        onPress: () => {
                                            router.back();
                                            setIsClockRunning(false);
                                            reset();
                                        },
                                    },
                                ]);
                            }}
                        />
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={() => {
                                setIsClockRunning(false);

                                Alert.alert("提出しますか？", "提出後は内容を変更できません。", [
                                    { text: "キャンセル", style: "cancel", onPress: () => setIsClockRunning(true) },
                                    {
                                        text: "提出する",
                                        style: "default",
                                        onPress: onSubmit,
                                    },
                                ]);
                            }}
                            style={styles.finishButton}
                        >
                            <Text style={styles.finishText}>提出</Text>
                        </Pressable>
                    ),
                }}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={userHeaderHeight}
            >
                <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                    <View style={styles.promptContainer}>
                        <Text style={styles.promptTitle}>{selectedTopic.topic}</Text>
                        <Text style={styles.promptDescription}>{selectedTopic.description}</Text>
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
                    <Pressable style={styles.timerContainer} onPress={() => setIsClockHidden(!isClockHidden)}>
                        <Text style={styles.timerText}>
                            {!isClockHidden || timeLeftSeconds < 60 ? formatTime(timeLeftSeconds) : "--:--"}
                        </Text>
                    </Pressable>
                    <Text style={styles.wordCountText}>
                        <Text style={styles.currentWordCount}>{wordCount}</Text> /{" "}
                        {selectedTopic.recommended_word_count} words
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
    finishButton: {
        backgroundColor: Variables.primary600,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    finishText: {
        color: Variables.white,
        fontWeight: "bold",
        fontSize: 14,
    },
});
