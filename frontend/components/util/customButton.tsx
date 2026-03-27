import React from "react";
import Variables from "@/constants/Variables";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
    text: string;
    iconName?: string;
    variant?: "primary" | "secondary";
    isSelected?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    flex?: number;
    style?: any;
    onPress: () => void;
}

const CustomButton = ({
    text,
    iconName,
    variant = "primary",
    isSelected = true,
    isDisabled,
    isLoading = false,
    flex = 0,
    style,
    onPress,
}: Props) => {
    const isPrimary = variant === "primary";

    const backgroundColor =
        isDisabled || isLoading
            ? Variables.gray100
            : isPrimary
              ? isSelected
                  ? Variables.primary600
                  : Variables.gray100
              : Variables.white;
    const textColor = isDisabled
        ? Variables.gray300
        : isPrimary
          ? isSelected
              ? Variables.white
              : Variables.gray400
          : Variables.primary600;
    const iconColor = isDisabled || isLoading ? Variables.gray300 : textColor;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={[
                styles.container,
                !isPrimary && styles.secondary,
                isSelected && isPrimary && !isDisabled && !isLoading && styles.shadow,
                isDisabled && styles.disabledContainer,
                { backgroundColor, flex },
                style,
            ]}
        >
            {!isLoading && <Text style={[styles.text, { color: textColor }]}>{text}</Text>}

            {iconName && !isLoading && <FontAwesome6 name={iconName} size={16} color={iconColor} style={styles.icon} />}
            {isLoading && <ActivityIndicator size="small" color={iconColor} style={styles.icon} />}
        </Pressable>
    );
};

export { CustomButton };

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        borderRadius: Variables.borderRadiusSecondary,
    },
    disabledContainer: {
        backgroundColor: Variables.gray100,
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
