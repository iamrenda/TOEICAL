import React from "react";
import Variables from "@/constants/Variables";
import useQuestionOverviewStore from "@/store/useQuestionOverviewStore";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { QuestionOverviewItem, QuestionOverviewFilter } from "@/components";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import showErrorAlert from "@/util/showErrorAlert";
import { ErrorMessages } from "@/constants/ErrorMessages";
import { router } from "expo-router";

const ReviewScreen = () => {
    const { fetchQuestions, questions, isLoading } = useQuestionOverviewStore();

    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        const fetchData = async () => {
            const res = await fetchQuestions();

            if (!res.success) {
                if (res.errorType) {
                    showErrorAlert({ message: ErrorMessages[res.errorType] });
                    router.replace("/(tabs)/(home)");
                }
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
    }

    return (
        <View style={{ flex: 1, backgroundColor: "red" }}>
            <View style={{ height: insets.top, backgroundColor: Variables.white }} />

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
        paddingTop: 16,
        paddingHorizontal: 24,
        paddingBottom: 96,
    },
    dropdownContainer: {
        flex: 1,
        marginBottom: 16,
        width: "50%",
    },
});
