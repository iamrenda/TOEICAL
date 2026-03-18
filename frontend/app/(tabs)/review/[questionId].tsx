import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Question = () => {
    const { questionId } = useLocalSearchParams();

    return (
        <View>
            <Text>Question {questionId}</Text>
        </View>
    );
};

export default Question;

const styles = StyleSheet.create({});
