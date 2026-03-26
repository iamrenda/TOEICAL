import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import React from "react";
import { QuestionOverviewItem, QuestionOverviewFilter } from "@/components";
import Variables from "@/constants/Variables";
import useQuestionOverviewStore from "@/store/useQuestionOverview";

const ReviewScreen = () => {
    const { fetchQuestions, questions, isLoading } = useQuestionOverviewStore();

    React.useEffect(() => {
        fetchQuestions();
    }, []);

    if (isLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    }

    return (
        <View style={styles.container}>
            <QuestionOverviewFilter />

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 36 }} />
            ) : (
                <FlatList
                    data={questions}
                    renderItem={({ item }) => <QuestionOverviewItem overview={item} />}
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
