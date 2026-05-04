import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Variables from "@/constants/Variables";
import { FontAwesome6 } from "@expo/vector-icons";
import { CustomButton } from "@/components/util/customButton";
import getDifficultyColor from "@/util/getDifficultyColor";
import { Footer } from "@/components";
import { router } from "expo-router";

const WritingTopicCardModal = () => {
    // CHECK
    const selectedItem = {
        id: 10,
        topic: "What is your favorite way to travel — by car, train, or plane?",
        description:
            "Pick your preferred mode of travel and explain what you like about it. You can also describe a trip you took using that method.",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 70,
        tags: ["daily-life", "opinion"],
    };

    const handleStart = () => {
        router.back();
        router.push(`/(writing)/${selectedItem.id}`);
    };

    return (
        <SafeAreaView style={styles.modalContainer} edges={["bottom"]}>
            <ScrollView>
                {selectedItem && (
                    <>
                        {/* Difficulty Badge */}
                        <View style={{ marginBottom: 24 }}>
                            <View
                                style={[
                                    styles.badge,
                                    styles.largeBADGE,
                                    {
                                        backgroundColor: getDifficultyColor(selectedItem.difficulty.toUpperCase()).bg,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.badgeText,
                                        styles.largeBadgeText,
                                        {
                                            color: getDifficultyColor(selectedItem.difficulty.toUpperCase()).text,
                                        },
                                    ]}
                                >
                                    {selectedItem.difficulty.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.modalTopic}>{selectedItem.topic}</Text>
                        <Text style={styles.modalDescription}>{selectedItem.description}</Text>

                        <View style={styles.tagsContainer}>
                            {selectedItem.tags.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}># {tag}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <FontAwesome6 name="clock" size={18} color={Variables.primary600} />
                                <Text style={styles.modalText}>{selectedItem.limit_time_minutes} minutes</Text>
                            </View>

                            <View style={styles.infoItem}>
                                <FontAwesome6 name="pencil" size={18} color={Variables.primary600} />
                                <Text style={styles.modalText}>{selectedItem.recommended_word_count} words (推奨)</Text>
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>

            <Footer>
                <CustomButton text="スタート！" onPress={handleStart} flex={1} />
            </Footer>
        </SafeAreaView>
    );
};

export default WritingTopicCardModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Variables.white,
        paddingTop: 24,
        paddingHorizontal: 24,
    },
    modalTopic: {
        fontSize: 26,
        fontWeight: "bold",
        color: Variables.textPrimary,
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 16,
        color: Variables.textSecondary,
        lineHeight: 22,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 32,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    modalSectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: Variables.textPrimary,
        marginBottom: 8,
    },
    modalText: {
        fontWeight: "500",
        fontSize: 16,
        color: Variables.textSecondary,
        lineHeight: 22,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    largeBADGE: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignSelf: "flex-start",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    largeBadgeText: {
        fontSize: 12,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 36,
    },
    tag: {
        backgroundColor: Variables.primary100,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: Variables.primary600,
        fontWeight: "600",
    },
    modalFooter: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Variables.white,
        borderTopWidth: 1,
        borderTopColor: Variables.gray100,
    },
});
