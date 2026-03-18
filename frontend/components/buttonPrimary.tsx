import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";

interface Props {
    text: string;
    iconName?: string;
    onPress: () => void;
}

const CustomButtonPrimary = ({ text, iconName, onPress }: Props) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
            {iconName && <FontAwesome6 name={iconName} size={16} color={Variables.white} style={styles.icon} />}
        </Pressable>
    );
};

export default CustomButtonPrimary;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
        boxShadow: `0px 20px 25px -5px #2b6cee39, 0px 8px 10px -5px #2b6cee39`,
        backgroundColor: Variables.primary600,
        borderRadius: Variables.borderRadiusSecondary,
    },
    icon: {
        marginLeft: 8,
    },
    text: {
        color: Variables.white,
        fontSize: 16,
        fontWeight: "bold",
    },
});
