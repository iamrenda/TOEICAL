import { FlatList, Text, View } from "react-native";
import React from "react";
import Variables from "@/constants/Variables";
import useFetchData from "@/util/useFetchData";

interface Overview {
    id: number;
    question: string;
    is_starred: boolean;
    was_last_attempt_correct: boolean | null;
    last_answered_at: string | null;
}

const Refresh = () => {
    const { data, isLoading, error } = useFetchData<Overview>(
        `${Variables.BASE_URL_API}/question/overview?sortBy=id.asc&limit=10&page=1&starred=false`,
    );

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList data={data} renderItem={({ item }) => <Text>{item.question}</Text>} />
        </View>
    );
};

export default Refresh;
