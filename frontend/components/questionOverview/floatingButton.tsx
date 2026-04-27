import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Variables from "@/constants/Variables";

interface Props {
    onPress: () => void;
}

const FloatingButton = ({ onPress }: Props) => {
    const insets = useSafeAreaInsets();

    return (
        <Pressable style={[styles.button, { bottom: insets.bottom + 64 }]} onPress={onPress}>
            <FontAwesome6 name="play" size={18} color="#fff" />
        </Pressable>
    );
};

export default FloatingButton;

const styles = StyleSheet.create({
    button: {
        position: "absolute",
        margin: 16,
        right: 16,
        backgroundColor: Variables.primary600,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
