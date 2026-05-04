import Variables from "@/constants/Variables";
import { router, useNavigation } from "expo-router";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import getDifficultyColor from "@/util/getDifficultyColor";

const difficulties = ["ALL", "EASY", "MEDIUM", "HARD"];
const topics = ["ALL", "BUSINESS", "SOCIAL", "TECH"];

const rawData = [
    {
        id: 1,
        topic: "Describe your perfect morning routine.",
        description:
            "Write about what you do (or wish you could do) from the moment you wake up until you start your day. Include details about what makes it perfect for you.",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 70,
        tags: ["daily-life", "reflection"],
    },
    {
        id: 2,
        topic: "What is your favorite food and why?",
        description:
            "Describe a dish you love and explain what makes it special to you. Is it the taste, the memories, or the person who cooks it?",
        difficulty: "easy",
        limit_time_minutes: 6,
        recommended_word_count: 65,
        tags: ["daily-life", "reflection"],
    },
    {
        id: 3,
        topic: "Describe the place where you feel most relaxed.",
        description:
            "Write about a specific place — a room, a park, a café — where you feel calm and happy. Describe what you see, hear, and feel there.",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 75,
        tags: ["daily-life", "reflection"],
    },
    {
        id: 4,
        topic: "What do you do on a typical weekend?",
        description:
            "Walk the reader through a regular weekend day in your life. Include the small details that make your weekends yours.",
        difficulty: "easy",
        limit_time_minutes: 6,
        recommended_word_count: 65,
        tags: ["daily-life"],
    },
    {
        id: 5,
        topic: "Describe your closest friend.",
        description:
            "Write about one person you are close to. What do they look like? What do you enjoy doing together? What makes them a good friend?",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 70,
        tags: ["daily-life", "social"],
    },
    {
        id: 6,
        topic: "What is something you are really good at?",
        description:
            "Choose one skill or activity you do well and describe how you do it. Explain when you learned it and how it makes you feel.",
        difficulty: "easy",
        limit_time_minutes: 6,
        recommended_word_count: 65,
        tags: ["reflection"],
    },
    {
        id: 7,
        topic: "Describe a meal you recently enjoyed.",
        description:
            "Think about a recent meal that was delicious or memorable. Describe the food, the setting, and the people you were with.",
        difficulty: "easy",
        limit_time_minutes: 5,
        recommended_word_count: 60,
        tags: ["daily-life"],
    },
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
        topic: "Describe your home or the room you spend the most time in.",
        description:
            "Write about the space where you live or relax the most. Describe what it looks like and what you do there.",
        difficulty: "easy",
        limit_time_minutes: 6,
        recommended_word_count: 65,
        tags: ["daily-life"],
    },
    {
        id: 10,
        topic: "What is your favorite way to travel — by car, train, or plane?",
        description:
            "Pick your preferred mode of travel and explain what you like about it. You can also describe a trip you took using that method.",
        difficulty: "easy",
        limit_time_minutes: 7,
        recommended_word_count: 70,
        tags: ["daily-life", "opinion"],
    },
];

// Helper to group by the first tag
const groupData = (data: typeof rawData) => {
    const grouped = data.reduce(
        (acc, item) => {
            const mainTag = item.tags[0] || "other";
            const categoryMap: Record<string, { name: string; icon: string }> = {
                business: { name: "ビジネス", icon: "briefcase" },
                social: { name: "社会問題", icon: "globe-americas" },
                "daily-life": { name: "日常", icon: "sun" },
            };

            const categoryInfo = categoryMap[mainTag] || { name: mainTag.toUpperCase(), icon: "hashtag" };

            if (!acc[categoryInfo.name]) {
                acc[categoryInfo.name] = {
                    category: categoryInfo.name,
                    count: 0,
                    icon: categoryInfo.icon,
                    items: [] as typeof rawData,
                };
            }
            acc[categoryInfo.name].items.push(item);
            acc[categoryInfo.name].count++;
            return acc;
        },
        {} as Record<string, { category: string; count: number; icon: string; items: typeof rawData }>,
    );

    return Object.values(grouped);
};

const dummyData = groupData(rawData);

const WritingScreen = () => {
    const [selectedDifficulty, setSelectedDifficulty] = React.useState("ALL");
    const [selectedTopic, setSelectedTopic] = React.useState("ALL");

    const onClickItem = () => {
        router.push(`/(tabs)/(writing)/writingTopicCardModal`);
    };

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
                    <Text style={styles.filterLabel}>DIFFICULTY:</Text>
                    <View style={styles.filterRow}>
                        {difficulties.map((diff) => (
                            <TouchableOpacity
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
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={[styles.filterLabel, { marginTop: 16 }]}>TOPIC:</Text>
                    <View style={styles.filterRow}>
                        {topics.map((topic) => (
                            <TouchableOpacity
                                key={topic}
                                style={[styles.filterButton, selectedTopic === topic && styles.filterButtonActive]}
                                onPress={() => setSelectedTopic(topic)}
                            >
                                <Text
                                    style={[
                                        styles.filterButtonText,
                                        selectedTopic === topic && styles.filterButtonTextActive,
                                    ]}
                                >
                                    {topic}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {dummyData.map((section, index) => (
                    <View key={index} style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionTitleRow}>
                                <FontAwesome5
                                    name={section.icon}
                                    size={18}
                                    color={Variables.primary600}
                                    style={styles.sectionIcon}
                                />
                                <Text style={styles.sectionTitle}>{section.category}</Text>
                            </View>
                            <Text style={styles.sectionCount}>{section.count} TOPICS AVAILABLE</Text>
                        </View>

                        {section.items.map((item) => {
                            const diffColors = getDifficultyColor(item.difficulty.toUpperCase());
                            return (
                                <TouchableOpacity key={item.id} style={styles.card} onPress={onClickItem}>
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
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))}

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
        marginBottom: 32,
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
    sectionContainer: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    sectionIcon: {
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Variables.textPrimary,
    },
    sectionCount: {
        fontSize: 10,
        fontWeight: "bold",
        color: Variables.gray400,
        letterSpacing: 1,
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
    chevronStarred: {
        position: "absolute",
        top: 20,
        right: 20,
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
