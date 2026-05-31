import Variables from "@/constants/Variables";
import useWritingStore from "@/store/useWritingStore";
import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = WINDOW_WIDTH * 0.85;
const SPACING = 16;
const PADDING_HORIZONTAL = (WINDOW_WIDTH - CARD_WIDTH - SPACING) / 2;

const AiEssay = () => {
    const { userEssay, essayAnalysisResult } = useWritingStore();

    // fallback UI
    if (!essayAnalysisResult) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>エッセイの読み込みに失敗しました。もう一度試してください。</Text>
            </View>
        );
    }

    const { revised_essay } = essayAnalysisResult;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>AIと比較してみましょう！</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={styles.pager}
                style={styles.scrollContainer}
            >
                {/* User Essay Card */}
                <View style={[styles.card, { width: CARD_WIDTH, marginHorizontal: SPACING / 2 }]}>
                    <Text style={[styles.heading, { color: Variables.primary600 }]}>あなたのエッセイ</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.innerScroll}>
                        <Text style={styles.essayText}>{userEssay}</Text>
                    </ScrollView>
                </View>

                {/* AI Essay Card */}
                <View style={[styles.card, { width: CARD_WIDTH, marginHorizontal: SPACING / 2 }]}>
                    <Text style={[styles.heading, { color: "#9D00FF" }]}>AI 生成のエッセイ</Text>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.innerScroll}>
                        <Text style={styles.essayText}>{revised_essay}</Text>
                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

export default AiEssay;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D1425",
        paddingBottom: 40,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        padding: 16,
        paddingBottom: 8,
        color: "#fff",
        textAlign: "center",
    },
    scrollContainer: {
        flex: 1,
    },
    pager: {
        paddingHorizontal: PADDING_HORIZONTAL,
        alignItems: "stretch",
        paddingVertical: 16,
    },
    card: {
        backgroundColor: "#f0f0f0",
        borderRadius: 16,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    heading: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
        color: Variables.textPrimary,
    },
    innerScroll: {
        flex: 1,
    },
    essayText: {
        fontSize: 16,
        lineHeight: 26,
        color: Variables.textPrimary,
    },
});
