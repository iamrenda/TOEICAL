import { Pressable, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Variables from "@/constants/Variables";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";

interface Props {
    text: string;
    iconName?: string;
    isSelected: boolean;
    onPress: () => void;
}

const CustomButtonPrimary = ({ text, iconName, isSelected, onPress }: Props) => {
    const animatedValue = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isSelected ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [animatedValue, isSelected]);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Variables.gray100, Variables.primary600],
    });

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -2],
    });

    const textColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [Variables.gray400, Variables.white],
    });

    return (
        <Pressable onPress={onPress} style={{ width: "100%" }}>
            <Animated.View
                style={[
                    styles.container,
                    { backgroundColor, transform: [{ translateY }] },
                    isSelected && styles.shadow,
                ]}
            >
                <Animated.Text style={[styles.text, { color: textColor }]}>{text}</Animated.Text>
                {iconName && <FontAwesome6 name={iconName} size={16} color={Variables.white} style={styles.icon} />}
            </Animated.View>
        </Pressable>
    );
};

export default CustomButtonPrimary;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 20,
        alignItems: "center",
        borderRadius: Variables.borderRadiusSecondary,
    },
    icon: {
        marginLeft: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
    },
    shadow: {
        boxShadow: `0px 20px 25px -5px #2b6cee39, 0px 8px 10px -5px #2b6cee39`,
    },
});
