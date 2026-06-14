import React from "react";
import { WritingTags } from "@/types/Writing";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Variables from "@/constants/Variables";
import useWritingStore from "@/store/useWritingStore";

const TagSelector = () => {
    const { selectedTags, setSelectedTags } = useWritingStore();

    return (
        <>
            <Text style={styles.filterLabel}>タグ:</Text>
            <View style={styles.filterRow}>
                {Object.values(WritingTags).map((tag) => (
                    <Pressable
                        key={tag}
                        style={[styles.filterButton, selectedTags === tag && styles.filterButtonActive]}
                        onPress={() => setSelectedTags(tag)}
                    >
                        <Text style={[styles.filterButtonText, selectedTags === tag && styles.filterButtonTextActive]}>
                            {tag}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </>
    );
};

export { TagSelector };

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
