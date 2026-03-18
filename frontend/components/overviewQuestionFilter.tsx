import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Variables from "@/constants/Variables";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";

type Filter = "all" | "starred";

const filters: { label: string; icon: string | null; iconFilled?: string; value: Filter }[] = [
    { label: "すべて", icon: null, value: "all" },
    { label: "お気に入り", icon: "star-o", iconFilled: "star", value: "starred" },
];

const OverviewQuestionFilter = () => {
    const [selectedFilter, setSelectedFilter] = useState<Filter>("all");

    return (
        <View style={styles.filterContainer}>
            {filters.map((filter) => (
                <Pressable
                    key={filter.value}
                    style={[styles.filterButton, selectedFilter === filter.value && styles.selectedFilterButton]}
                    onPress={() => setSelectedFilter(filter.value)}
                >
                    {filter.icon && (
                        <FontAwesome
                            name={
                                selectedFilter === filter.value && filter.iconFilled
                                    ? filter.iconFilled
                                    : (filter.icon as any)
                            }
                            size={16}
                            color={selectedFilter === filter.value ? Variables.white : Variables.textTertiary}
                        />
                    )}
                    <Text
                        style={[
                            styles.filterButtonText,
                            selectedFilter === filter.value && styles.selectedFilterButtonText,
                        ]}
                    >
                        {filter.label}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
};

export default OverviewQuestionFilter;

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 12,
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Variables.borderRadiusSecondary,
        backgroundColor: Variables.white,
        borderWidth: 1,
        borderColor: Variables.border,
    },
    selectedFilterButton: {
        backgroundColor: Variables.primary600,
        borderColor: Variables.primary600,
    },
    filterButtonText: {
        color: Variables.gray800,
    },
    selectedFilterButtonText: {
        color: Variables.white,
        fontWeight: "600",
    },
});
