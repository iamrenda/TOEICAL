import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";

interface Props {
    text: string;
    iconName?: string;
    variant?: "primary" | "secondary";
    isSelected?: boolean;
    isDisabled?: boolean;
    flex?: number;
    onPress: () => void;
}

const CustomButton = ({ text, iconName, variant = "primary", isSelected = true, isDisabled, flex, onPress }: Props) => {
    const isPrimary = variant === "primary";

    const backgroundColor = isPrimary ? (isSelected ? Variables.primary600 : Variables.gray100) : Variables.white;
    const textColor = isPrimary ? (isSelected ? Variables.white : Variables.gray400) : Variables.primary600;
    const iconColor = textColor;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.container,
                !isPrimary && styles.secondary,
                isSelected && isPrimary && styles.shadow,
                { backgroundColor, flex: flex ?? 1 },
            ]}
        >
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>

            {iconName && <FontAwesome6 name={iconName} size={16} color={iconColor} style={styles.icon} />}
        </Pressable>
    );
};

export default CustomButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: Variables.borderRadiusSecondary,
    },

    secondary: {
        borderWidth: 2,
        borderColor: Variables.primary600,
    },

    shadow: {
        boxShadow: `0px 20px 25px -5px #2b6cee39, 0px 8px 10px -5px #2b6cee39`,
    },

    text: {
        fontSize: 16,
        fontWeight: "bold",
    },

    icon: {
        marginLeft: 8,
    },
});
