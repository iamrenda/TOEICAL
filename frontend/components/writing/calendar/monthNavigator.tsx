import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import useWritingHistory from "@/store/useWritingHistory";

const MonthNavigator = () => {
    const { currentMonth, currentYear, setPreviousMonth, setNextMonth } = useWritingHistory();

    const monthLabel = `${currentYear}年${currentMonth}月`;

    return (
        <View style={styles.container}>
            <Pressable style={styles.navButton} onPress={setPreviousMonth}>
                <FontAwesome6 name="chevron-left" size={16} color={Variables.textPrimary} />
            </Pressable>

            <Text style={styles.monthLabel}>{monthLabel}</Text>

            <Pressable style={styles.navButton} onPress={setNextMonth}>
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
