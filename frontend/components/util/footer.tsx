import React from "react";
import Variables from "@/constants/Variables";
import { StyleSheet, View } from "react-native";

const Footer = ({ children }: { children: React.ReactNode }) => {
    return <View style={styles.container}>{children}</View>;
};

export { Footer };

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "auto",
        paddingBottom: 42,
        backgroundColor: Variables.white,
    },
});
