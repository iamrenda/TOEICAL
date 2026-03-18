import { StyleSheet, View } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";

const Footer = ({ children }: { children: React.ReactNode }) => {
    return <View style={styles.container}>{children}</View>;
};

export default Footer;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "auto",
        paddingTop: 12,
        paddingBottom: 24,
        backgroundColor: Variables.white,
        // borderTopWidth: 1,
        // borderTopColor: Variables.border,
    },
});
