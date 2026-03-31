import Variables from "@/constants/Variables";
import useUserStore from "@/store/useUserStore";
import { StyleSheet, Text, View } from "react-native";
import { GamemodeList, Header, StatusList } from "@/components";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
    const { username } = useUserStore();

    return (
        <SafeAreaView style={styles.conatiner}>
            <Header style={styles.headerStyle}>
                <Text style={styles.headerTitleText}>TOEICAL</Text>
            </Header>

            <View style={styles.greetContainer}>
                <Text style={styles.greetTitle}>おはよう、{username}</Text>
                <Text style={styles.greetSubtitle}>今日も練習を始めましょう。</Text>
            </View>

            <StatusList />
            <GamemodeList />
        </SafeAreaView>
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

    headerStyle: {
        paddingBottom: 36,
    },
    headerTitleText: {
        color: Variables.primary600,
        fontWeight: "800",
        fontSize: 20,
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
