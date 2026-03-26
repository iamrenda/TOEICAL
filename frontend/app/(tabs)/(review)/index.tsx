import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React from "react";
import QuestionOverview from "@/components/questionOverview";
import OverviewQuestionFilter from "@/components/overviewQuestionFilter";
import Variables from "@/constants/Variables";
import useQuestionOverviewStore from "@/store/useQuestionOverview";

const ReviewScreen = () => {
    const { fetchQuestions, questions, isLoading } = useQuestionOverviewStore();

    React.useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <View style={styles.container}>
            <OverviewQuestionFilter />

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 36 }} />
            ) : (
                <FlatList
                    data={questions}
                    renderItem={({ item }) => <QuestionOverview overview={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.contentContainer}
                />
            )}
        </View>
    );
};

export default ReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Variables.background,
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
