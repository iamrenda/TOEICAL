import Variables from "@/constants/Variables";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import React from "react";
import useWritingStore from "@/store/useWritingStore";
import { FilterSection, TopicCardList } from "@/components";

const WritingScreen = () => {
    const { isLoading, allTopics } = useWritingStore();

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <ScrollView contentContainerStyle={styles.container}>
                <FilterSection />

                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : !allTopics ? (
                    <Text style={styles.errorText}>トピックを取得できませんでした</Text>
                ) : allTopics.length === 0 ? (
                    <Text style={styles.errorText}>条件に合うトピックが見つかりませんでした</Text>
                ) : (
                    <TopicCardList />
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
    errorText: {
        fontSize: 14,
        color: Variables.gray500,
        textAlign: "center",
        marginTop: 40,
    },
});
