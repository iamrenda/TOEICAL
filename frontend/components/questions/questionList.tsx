import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

const DATA:  = [
    {
        question_number: 1082,
        isStarred: false,
        hasAnswered: true,
        question: "The supervisor requested that all employees ________ their reports by the end of the month",
    },
    {
        id: 1082,
        isStarred: true,
        hasAnswered: false,
        question: "The upcoming marketing campaign aims to ________ brand awareness among younger demographics.",
    },
];

const QuestionList = () => {
    return <FlatList data={DATA} renderItem={} />;
};

export default QuestionList;

const styles = StyleSheet.create({});
