import Variables from "@/constants/Variables";
import { router } from "expo-router";
import { StyleSheet, Text, View, TextInput, ScrollView, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import getDifficultyColor from "@/util/getDifficultyColor";
import useWritingStore from "@/store/useWritingStore";
import { WritingDifficulty, WritingTags } from "@/types/Writing";

const WritingScreen = () => {
    const [selectedDifficulty, setSelectedDifficulty] = React.useState<WritingDifficulty>(WritingDifficulty.ALL);
    const [selectedTags, setSelectedTags] = React.useState<WritingTags>(WritingTags.ALL);

    const { isLoading, allTopics, setSelectedTopic, fetchTopics } = useWritingStore();

    const onClickTopicItem = (id: number) => {
        setSelectedTopic(id);
        router.push(`/(tabs)/(writing)/writingTopicCardModal`);
    };

    React.useEffect(() => {
        fetchTopics(selectedDifficulty, selectedTags);
    }, [selectedDifficulty, selectedTags]);

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={Variables.primary600} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="キーワードで検索..."
                            placeholderTextColor={Variables.gray300}
                        />
                    </View>
                </View>

                <View style={styles.filterSection}>
                    <Text style={styles.filterLabel}>難易度:</Text>
                    <View style={styles.filterRow}>
                        {Object.values(WritingDifficulty).map((diff) => (
                            <Pressable
                                key={diff}
                                style={[styles.filterButton, selectedDifficulty === diff && styles.filterButtonActive]}
                                onPress={() => setSelectedDifficulty(diff)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedDifficulty === diff && styles.filterButtonTextActive,
                                    ]}
                                >
                                    {diff}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <Text style={styles.filterLabel}>タグ:</Text>
                    <View style={styles.filterRow}>
                        {Object.values(WritingTags).map((tag) => (
                            <Pressable
                                key={tag}
                                style={[styles.filterButton, selectedTags === tag && styles.filterButtonActive]}
                                onPress={() => setSelectedTags(tag)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedTags === tag && styles.filterButtonTextActive,
                                    ]}
                                >
                                    {tag}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : !allTopics ? (
                    <Text style={styles.errorText}>トピックを取得できませんでした</Text>
                ) : allTopics.length === 0 ? (
                    <Text style={styles.errorText}>条件に合うトピックが見つかりませんでした</Text>
                ) : (
                    <View>
                        <Text style={styles.topicCount}>{allTopics?.length} 件見つかりました</Text>

                        {allTopics?.map((item) => {
                            const diffColors = getDifficultyColor(item.difficulty);

                            return (
                                <Pressable key={item.id} style={styles.card} onPress={() => onClickTopicItem(item.id)}>
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.badge, { backgroundColor: diffColors.bg }]}>
                                            <Text style={[styles.badgeText, { color: diffColors.text }]}>
                                                {item.difficulty.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.cardTitle}>{item.topic}</Text>
                                    <Text style={styles.cardDescription} numberOfLines={2}>
                                        {item.description}
                                    </Text>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.footerItem}>
                                            <FontAwesome6 name="clock" size={14} color={Variables.gray500} />
                                            <Text style={styles.footerText}>{item.limit_time_minutes} MIN</Text>
                                        </View>
                                        <View style={styles.footerItem}>
                                            <FontAwesome6 name="pencil" size={14} color={Variables.gray500} />
                                            <Text style={styles.footerText}>{item.recommended_word_count} WORDS</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default WritingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Variables.background,
    },
    container: {
        padding: 24,
        backgroundColor: Variables.background,
    },
    header: {
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Variables.white,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Variables.textPrimary,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: Variables.primary800,
        marginBottom: 12,
        letterSpacing: 1,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Variables.white,
        borderWidth: 1,
        borderColor: Variables.gray150,
    },
    filterButtonActive: {
        backgroundColor: Variables.primary100,
        borderColor: Variables.primary500,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Variables.textSecondary,
    },
    filterButtonTextActive: {
        color: Variables.primary500,
    },
    card: {
        backgroundColor: Variables.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        position: "relative",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    topicCount: {
        fontSize: 14,
        color: Variables.textSecondary,
        marginBottom: 16,
        textAlign: "right",
    },
    errorText: {
        fontSize: 14,
        color: Variables.gray500,
        textAlign: "center",
        marginTop: 40,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.textPrimary,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: Variables.textSecondary,
        lineHeight: 22,
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: "row",
        gap: 16,
    },
    footerItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    footerText: {
        fontSize: 12,
        color: Variables.gray500,
        fontWeight: "600",
        letterSpacing: 0.5,
    },
});
