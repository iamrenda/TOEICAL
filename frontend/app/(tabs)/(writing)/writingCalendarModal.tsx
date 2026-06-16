import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Variables from "@/constants/Variables";
import { CalendarEntryFooter, Calendar, MonthNavigator } from "@/components";
import useWritingHistory from "@/store/useWritingHistory";

const WritingCalendarModal = () => {
    const { isLoading } = useWritingHistory();

    return (
        <SafeAreaView style={styles.container} edges={["bottom"]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.heading}>My ライティング</Text>

                <MonthNavigator />
                <Calendar />
                {isLoading ? <ActivityIndicator /> : <CalendarEntryFooter />}

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default WritingCalendarModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Variables.white,
        paddingTop: 12,
        paddingHorizontal: 24,
    },
    heading: {
        fontSize: 22,
        fontWeight: "800",
        color: Variables.textPrimary,
        marginBottom: 18,
    },
});
