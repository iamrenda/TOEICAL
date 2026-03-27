import Variables from "@/constants/Variables";
import { StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const AuthHeader = () => {
    return (
        <View style={styles.headerContainer}>
            <FontAwesome6 name="graduation-cap" size={24} color={Variables.white} style={styles.headerIcon} />
            <Text style={styles.headerTitle}>TOEICAL</Text>
            <Text style={styles.headerSubtitle}>TOEICから始める英語学習アプリ</Text>
        </View>
    );
};

export { AuthHeader };

const styles = StyleSheet.create({
    headerContainer: {
        alignItems: "center",
        marginBottom: 36,
    },
    headerIcon: {
        marginBottom: 8,
        backgroundColor: Variables.primary600,
        borderRadius: Variables.borderRadiusPrimary,
        padding: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: Variables.primary600,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Variables.textTertiary,
    },
});
