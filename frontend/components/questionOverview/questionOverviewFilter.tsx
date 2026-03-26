import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";
import FontAwesome from "@expo/vector-icons/build/FontAwesome";
import useQuestionOverviewStore from "@/store/useQuestionOverview";

type Filter = "all" | "starred";

const filters: { label: string; icon: string | null; iconFilled?: string; value: Filter }[] = [
    { label: "すべて", icon: null, value: "all" },
    { label: "お気に入り", icon: "star-o", iconFilled: "star", value: "starred" },
];

const OverviewQuestionFilter = () => {
    const { selectedFilter, setSelectedFilter } = useQuestionOverviewStore();

    return (
        <View style={styles.filterContainer}>
            {filters.map((filter) => {
                const isSelected = selectedFilter === filter.value;

                return (
                    <Pressable
                        key={filter.value}
                        style={[styles.filterButton, isSelected && styles.selectedFilterButton]}
                        onPress={() => setSelectedFilter(filter.value)}
                    >
                        {filter.icon && (
                            <FontAwesome
                                name={isSelected && filter.iconFilled ? filter.iconFilled : (filter.icon as any)}
                                size={16}
                                color={isSelected ? Variables.white : Variables.textTertiary}
                            />
                        )}
                        <Text style={[styles.filterButtonText, isSelected && styles.selectedFilterButtonText]}>
                            {filter.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
};

export { OverviewQuestionFilter };

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
