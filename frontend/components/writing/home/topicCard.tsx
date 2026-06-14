import Variables from "@/constants/Variables";
import { WritingTopic } from "@/types/Writing";
import getDifficultyColor from "@/util/getDifficultyColor";
import { FontAwesome6 } from "@expo/vector-icons";
import { Pressable, StyleSheet, View, Text } from "react-native";

interface Props {
    item: WritingTopic;
    onClickTopicItem: (id: number) => void;
}

const TopicCard = ({ item, onClickTopicItem }: Props) => {
    const diffColors = getDifficultyColor(item.difficulty);

    return (
        <Pressable style={styles.card} onPress={() => onClickTopicItem(item.id)}>
            <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: diffColors.bg }]}>
                    <Text style={[styles.badgeText, { color: diffColors.text }]}>{item.difficulty.toUpperCase()}</Text>
                </View>
            </View>

            <Text style={styles.cardTitle}>{item.topic}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
                {item.description}
            </Text>

            <View style={styles.cardFooter}>
                <View style={styles.footerItem}>
                    <FontAwesome6 name="clock" size={14} color={Variables.gray500} />
                    <Text style={styles.footerText}>{item.limit_time_minutes} 分</Text>
                </View>
                <View style={styles.footerItem}>
                    <FontAwesome6 name="pencil" size={14} color={Variables.gray500} />
                    <Text style={styles.footerText}>{item.recommended_word_count} 文字</Text>
                </View>
            </View>
        </Pressable>
    );
};

export { TopicCard };

const styles = StyleSheet.create({
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
});
