import React from "react";
import Variables from "@/constants/Variables";
import { WritingDifficulty } from "@/types/Writing";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useWritingStore from "@/store/useWritingStore";

const DifficultySelector = () => {
    const { selectedDifficulty, setSelectedDifficulty } = useWritingStore();

    return (
        <>
            <Text style={styles.filterLabel}>難易度:</Text>
            <View style={styles.filterRow}>
                {Object.values(WritingDifficulty).map((diff) => (
                    <Pressable
                        key={diff}
                        style={[styles.filterButton, selectedDifficulty === diff && styles.filterButtonActive]}
                        onPress={() => setSelectedDifficulty(diff)}
                    >
                        <Text
                            style={[
                                styles.filterButtonText,
                                selectedDifficulty === diff && styles.filterButtonTextActive,
                            ]}
                        >
                            {diff}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </>
    );
};

export { DifficultySelector };

const styles = StyleSheet.create({
    filterLabel: {
        fontSize: 12,
        fontWeight: "bold",
        color: Variables.primary800,
        marginBottom: 12,
        letterSpacing: 1,
    },
    filterRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Variables.white,
        borderWidth: 1,
        borderColor: Variables.gray150,
    },
    filterButtonActive: {
        backgroundColor: Variables.primary100,
        borderColor: Variables.primary500,
    },
    filterButtonText: {
        fontSize: 12,
        fontWeight: "600",
        color: Variables.textSecondary,
    },
    filterButtonTextActive: {
        color: Variables.primary500,
    },
});
