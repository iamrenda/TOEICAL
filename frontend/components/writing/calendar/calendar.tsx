import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Variables from "@/constants/Variables";
import { CalendarDayCell } from "./calendarDayCell";
import useWritingHistory from "@/store/useWritingHistory";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

const CalendarHeader = () => {
    return (
        <View style={styles.row}>
            {WEEKDAY_LABELS.map((label, index) => (
                <View key={label} style={styles.headerCell}>
                    <Text
                        style={[
                            styles.headerText,
                            index === 0 && { color: Variables.red500 },
                            index === 6 && { color: Variables.primary600 },
                        ]}
                    >
                        {label}
                    </Text>
                </View>
            ))}
        </View>
    );
};

const CalendarGrid = () => {
    const { currentYear, currentMonth, selectedDate, currentMonthHistory, getCurrentMonthHistory } =
        useWritingHistory();

    React.useEffect(() => {
        getCurrentMonthHistory();
    }, []);

    const today = new Date();
    const appendingDays = new Date(currentYear, currentMonth - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    return (
        <View style={styles.grid}>
            {Array.from({ length: appendingDays }).map((_, index) => {
                const cell = {
                    day: null,
                    weekday: index,
                    isSelected: false,
                    isToday: false,
                    hasEntry: false,
                };

                return (
                    <View key={`appending-${index}`} style={styles.gridItem}>
                        <CalendarDayCell cell={cell} />
                    </View>
                );
            })}
            {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isSelected =
                    selectedDate ===
                    `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                const cell = {
                    day,
                    weekday: (appendingDays + index) % 7,
                    isSelected,
                    isToday:
                        day === today.getDate() &&
                        currentMonth === today.getMonth() + 1 &&
                        currentYear === today.getFullYear(),
                    hasEntry: currentMonthHistory.some((entry) =>
                        entry.created_at.startsWith(
                            `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
                        ),
                    ),
                };

                return (
                    <View key={`day-${index + 1}`} style={styles.gridItem}>
                        <CalendarDayCell cell={cell} />
                    </View>
                );
            })}
        </View>
    );
};

const Calendar = () => {
    return (
        <View>
            <CalendarHeader />
            <CalendarGrid />
        </View>
    );
};

export { Calendar };

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
