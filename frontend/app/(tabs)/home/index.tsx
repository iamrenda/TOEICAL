import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";
import GamemodeList from "@/components/gamemodeList";
import StatusList from "@/components/statusList";

const Home = () => {
    return (
        <View style={styles.conatiner}>
            <View style={styles.greetContainer}>
                <Text style={styles.greetTitle}>おはよう、アレックス</Text>
                <Text style={styles.greetSubtitle}>今日も練習を始めましょう。</Text>
            </View>

            <StatusList />
            <GamemodeList />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    conatiner: {
        paddingTop: 16,
        paddingHorizontal: 24,
        backgroundColor: Variables.white,
        height: "100%",
    },

    greetContainer: {
        marginBottom: 16,
    },
    greetTitle: {
        color: Variables.textPrimary,
        fontWeight: "600",
        fontSize: 28,
        paddingBottom: 2,
    },
    greetSubtitle: {
        color: Variables.textSecondary,
        fontSize: 16,
    },
});
