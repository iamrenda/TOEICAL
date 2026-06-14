import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import { MONTH_LABEL } from "@/data/writingCalendarData";

const MonthNavigator = () => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.navButton}>
                <FontAwesome6 name="chevron-left" size={16} color={Variables.textPrimary} />
            </Pressable>

            <Text style={styles.monthLabel}>{MONTH_LABEL}</Text>

            <Pressable style={styles.navButton}>
                <FontAwesome6 name="chevron-right" size={16} color={Variables.textPrimary} />
            </Pressable>
        </View>
    );
};

export { MonthNavigator };

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    navButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Variables.gray50,
        alignItems: "center",
        justifyContent: "center",
    },
    monthLabel: {
        fontSize: 19,
        fontWeight: "800",
        color: Variables.textPrimary,
    },
});
