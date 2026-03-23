import { StyleSheet, Text, View } from "react-native";
import { Href, Link } from "expo-router";
import React from "react";
import Variables from "@/constants/Variables";

interface Props {
    text: string;
    linkLabel: string;
    linkDir: Href;
}

const AuthFooter = ({ text, linkLabel, linkDir }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.text}>または</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.linkContainer}>
                <Text style={styles.label}>{text}</Text>
                <Link href={linkDir} style={styles.linkLabel} replace>
                    {linkLabel}
                </Link>
            </View>
        </View>
    );
};

export default AuthFooter;

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
    },

    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
    },
    line: {
        borderBottomColor: Variables.border,
        borderBottomWidth: 1,
        flex: 1,
    },
    text: {
        color: Variables.textTertiary,
    },

    linkContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    label: {
        color: Variables.textSecondary,
    },
    linkLabel: {
        color: Variables.primary600,
        textDecorationLine: "underline",
    },
});
