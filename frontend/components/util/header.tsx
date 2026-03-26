import { StyleSheet, View } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";

interface Props {
    style: any;
    children: React.ReactNode;
}

const Header = ({ children, style }: Props) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

export { Header };

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Variables.white,
    },
});
