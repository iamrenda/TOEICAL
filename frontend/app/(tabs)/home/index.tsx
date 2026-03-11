import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import GamemodeList from "@/components/gamemodes/gamemodeList";
import StatusList from "@/components/status/statusList";

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
        paddingVertical: 36,
        paddingHorizontal: 24,
        backgroundColor: Colors.background,
        height: "100%",
    },

    greetContainer: {
        marginBottom: 16,
    },
    greetTitle: {
        color: Colors.textPrimary,
        fontWeight: "600",
        fontSize: 28,
        paddingBottom: 2,
    },
    greetSubtitle: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
});
