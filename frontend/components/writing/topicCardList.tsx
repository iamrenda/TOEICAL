import React from "react";
import useWritingStore from "@/store/useWritingStore";
import Variables from "@/constants/Variables";
import { View, Text, StyleSheet } from "react-native";
import { TopicCard } from "./topicCard";
import { router } from "expo-router";

const TopicCardList = () => {
    const { allTopics, setSelectedTopic } = useWritingStore();

    const onClickTopicItem = (id: number) => {
        setSelectedTopic(id);
        router.push(`/(tabs)/(writing)/writingTopicCardModal`);
    };

    return (
        <View>
            <Text style={styles.topicCount}>{allTopics?.length} 件見つかりました</Text>

            {allTopics?.map((item) => (
                <TopicCard key={item.id} item={item} onClickTopicItem={onClickTopicItem} />
            ))}
        </View>
    );
};

export { TopicCardList };

const styles = StyleSheet.create({
    topicCount: {
        fontSize: 14,
        color: Variables.textSecondary,
        marginBottom: 16,
        textAlign: "right",
    },
});
