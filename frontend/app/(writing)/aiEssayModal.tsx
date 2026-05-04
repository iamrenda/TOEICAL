import Variables from "@/constants/Variables";
import React from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = WINDOW_WIDTH * 0.85;
const SPACING = 16;
const PADDING_HORIZONTAL = (WINDOW_WIDTH - CARD_WIDTH - SPACING) / 2;

const AiEssay = () => {
    // Dummy essays
    const userEssay = `Rabbits and humans are similar in some ways but different in others. In general, it is known that rabbits are mammals like us and assume that they live a simple life compared to us. However, they still share certain similarities and differences in behaviors. One major difference between rabbits and humans is their level of intelligence when living. Humans are capable of complex thinking and creating tools on their own such as communicating with others using several languages or inventing wide variety of things such as computers. It is also known as having a complex society, having diverse cultural differences between each other. In contrast, rabbits rely mostly on instinct to survive. For example, gathering food, avoiding predators, and reproducing. Unlike humans, rabbits do not build or invent tools to survive. Instead, they use their own unique physical traits like how they raise their ears to dissipate heat or how they rely on agility to escape predators. This difference emphasizes the gap in abilities and lifestyle complexity between the two species.`;

    const aiEssay = `Rabbits and humans share certain similarities as mammals, yet they also differ in many significant ways. Although rabbits are often perceived as living simple lives compared to humans, they still display behaviors that reflect both shared traits and clear differences. By examining their intelligence, social behavior, and emotional responses, we can better understand how these two species are connected and how they diverge. One major difference between rabbits and humans lies in their level of intelligence and complexity of life. Humans are capable of advanced thinking, problem-solving, and creativity. They create tools, develop technologies such as computers, and communicate using complex languages. Human societies are also highly structured, with diverse cultures, traditions, and systems of organization. In contrast, rabbits primarily rely on instinct to survive. Their daily activities—such as finding food, avoiding predators, and reproducing—are driven by natural behaviors rather than learned innovation. Unlike humans, rabbits do not invent tools or build advanced systems. Instead, they depend on their physical adaptations, such as their strong hind legs for quick escape and large ears that help regulate body temperature. This contrast highlights the significant gap in intellectual ability and lifestyle complexity between the two species.`;

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
                        <Text style={styles.essayText}>{aiEssay}</Text>
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
