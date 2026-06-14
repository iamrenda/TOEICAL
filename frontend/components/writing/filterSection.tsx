import React from "react";
import { StyleSheet, View } from "react-native";
import { DifficultySelector } from "./difficultySelector";
import { TagSelector } from "./tagSelector";

const FilterSection = () => {
    return (
        <View style={styles.filterSection}>
            <DifficultySelector />
            <TagSelector />
        </View>
    );
};

export { FilterSection };

const styles = StyleSheet.create({
    filterSection: {
        marginBottom: 16,
    },
});
