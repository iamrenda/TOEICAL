import React from "react";
import Variables from "@/constants/Variables";
import { StyleSheet, Text, View } from "react-native";
import { CalendarCell } from "@/types/Writing";

interface Props {
    cell: CalendarCell;
}

const CalendarDayCell = ({ cell }: Props) => {
    // Empty leading cell — keeps the grid aligned without rendering content.
    if (cell.day === null) {
        return <View style={styles.cell} />;
    }

    const weekdayColor =
        cell.weekday === 0 ? Variables.red500 : cell.weekday === 6 ? Variables.primary600 : Variables.textPrimary;

    const circleStyle = [
        styles.circle,
        cell.isSelected && styles.circleSelected,
        !cell.isSelected && cell.isToday && styles.circleToday,
    ];

    const numberStyle = [
        styles.dayNumber,
        cell.isSelected ? styles.dayNumberSelected : cell.isToday ? styles.dayNumberToday : { color: weekdayColor },
    ];

    return (
        <View style={styles.cell}>
            <View style={circleStyle}>
                <Text style={numberStyle}>{cell.day}</Text>
            </View>
            <View style={[styles.dot, cell.hasEntry && styles.dotActive]} />
        </View>
    );
};

export { CalendarDayCell };

const styles = StyleSheet.create({
    cell: {
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
    },
    circle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
    },
    circleSelected: {
        backgroundColor: Variables.primary600,
        shadowColor: Variables.primary600,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 4,
    },
    circleToday: {
        backgroundColor: Variables.primary100,
        borderWidth: 1.5,
        borderColor: Variables.primary600,
    },
    dayNumber: {
        fontSize: 16,
        fontWeight: "600",
    },
    dayNumberSelected: {
        color: Variables.white,
        fontWeight: "800",
    },
    dayNumberToday: {
        color: Variables.primary600,
        fontWeight: "800",
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "transparent",
    },
    dotActive: {
        backgroundColor: Variables.primary600,
    },
});
