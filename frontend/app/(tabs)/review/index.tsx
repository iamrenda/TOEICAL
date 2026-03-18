import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { Overview } from "@/types/question";
import QuestionOverview from "@/components/questionOverview";
import OverviewQuestionFilter from "@/components/overviewQuestionFilter";

const DUMMY: Overview[] = [
    {
        id: 1,
        question:
            "Ms. Ortega’s development team contributed ——– to the successful launch of the newest mobile application.",
        is_starred: true,
        was_last_attempt_correct: false,
        last_answered_at: "2026-03-16T05:06:46.217Z",
    },
    {
        id: 2,
        question:
            "In order to meet production targets, inspection equipment that breaks down easily should be checked on a ——– basis.",
        is_starred: true,
        was_last_attempt_correct: true,
        last_answered_at: "2026-03-16T05:06:51.063Z",
    },
    {
        id: 3,
        question:
            "——– you experience any problems with the building’s equipment, you should contact the property manager.",
        is_starred: true,
        was_last_attempt_correct: true,
        last_answered_at: "2026-03-16T05:16:27.100Z",
    },
    {
        id: 4,
        question:
            "Employees must park in the ——- parking lot until the renovation of the company building is completed.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
    {
        id: 5,
        question: "Although the assembly machine has been used for more than 20 years, it is still ——–.",
        is_starred: false,
        was_last_attempt_correct: true,
        last_answered_at: "2026-03-16T05:06:29.929Z",
    },
    {
        id: 6,
        question:
            "Medical ——– are supposed to investigate the characteristics and effects of newly developed materials.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
    {
        id: 7,
        question: "Darwin Construction, renowned for its ——– designs, has won the bid for the Dalton City Library.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
    {
        id: 8,
        question: "Please make sure that ——– address is correct in the designated section of the order form.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
    {
        id: 9,
        question: "Mr. Thompson was ——– as the marketing director after a successful market development in Asia.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
    {
        id: 10,
        question: "The Irwin City Tourist Information Office is ——– located in the center of the city.",
        is_starred: false,
        was_last_attempt_correct: null,
        last_answered_at: null,
    },
];

const Refresh = () => {
    return (
        <View style={styles.container}>
            <OverviewQuestionFilter />

            <FlatList
                data={DUMMY}
                renderItem={({ item }) => <QuestionOverview overview={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.contentContainer}
            />
        </View>
    );
};

export default Refresh;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingBottom: 96,
    },
    dropdownContainer: {
        flex: 1,
        marginBottom: 16,
        width: "50%",
    },
});
