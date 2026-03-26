import { StyleSheet, Text, View } from "react-native";
import { GamemodeList, StatusList } from "@/components";
import Variables from "@/constants/Variables";
import useUserStore from "@/store/useUserStore";

const Index = () => {
    const { username } = useUserStore();

    return (
        <View style={styles.conatiner}>
            <View style={styles.greetContainer}>
                <Text style={styles.greetTitle}>おはよう、{username}</Text>
                <Text style={styles.greetSubtitle}>今日も練習を始めましょう。</Text>
            </View>

            <StatusList />
            <GamemodeList />
        </View>
    );
};

export default Index;

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
