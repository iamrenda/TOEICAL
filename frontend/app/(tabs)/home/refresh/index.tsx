import { Text, View } from "react-native";
import React from "react";

interface Overview {
    id: number;
    question: string;
    is_starred: boolean;
    was_last_attempt_correct: boolean | null;
    last_answered_at: string | null;
}

const Refresh = () => {
    return (
        <View>
            <Text>Refresh</Text>
        </View>
    );
};

export default Refresh;
