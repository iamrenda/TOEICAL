import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Variables from "@/constants/Variables";
import { CALENDAR_CELLS, WEEKDAY_LABELS } from "@/data/writingCalendarData";
import { CalendarDayCell } from "./calendarDayCell";

const CalendarGrid = () => {
    return (
        <View>
            {/* Weekday header */}
            <View style={styles.row}>
                {WEEKDAY_LABELS.map(({ label, weekday }) => (
                    <View key={label} style={styles.headerCell}>
                        <Text
                            style={[
                                styles.headerText,
                                weekday === "sun" && { color: Variables.red500 },
                                weekday === "sat" && { color: Variables.primary600 },
                            ]}
                        >
                            {label}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Day grid */}
            <View style={styles.grid}>
                {CALENDAR_CELLS.map((cell, index) => (
                    <View key={index} style={styles.gridItem}>
                        <CalendarDayCell cell={cell} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export { CalendarGrid };

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        marginBottom: 6,
    },
    headerCell: {
        flex: 1,
        alignItems: "center",
    },
    headerText: {
        fontSize: 13,
        fontWeight: "700",
        color: Variables.gray300,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 2,
    },
    gridItem: {
        // 7 columns
        width: `${100 / 7}%`,
    },
});
