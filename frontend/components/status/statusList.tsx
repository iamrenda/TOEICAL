import { StyleSheet, View } from "react-native";
import React from "react";
import { Status } from "@/components/status/status";
import StatusItem from "./statusItem";

const statuses: Status[] = [
    {
        color: "#F97316",
        icon: "fire-flame-curved",
        title: "継続日数",
        status: "15日",
        subTitle: "この調子！",
    },
    {
        color: "#3B82F6",
        icon: "snowman",
        title: "XP",
        status: "12,450",
        subTitle: "昨日 +150",
    },
];

const StatusList = () => {
    return (
        <View style={styles.statusContainer}>
            {statuses.map((status, i) => (
                <StatusItem status={status} key={i} />
            ))}
        </View>
    );
};

export default StatusList;

const styles = StyleSheet.create({
    statusContainer: {
        flexDirection: "row",
        marginBottom: 32,
        gap: 12,
    },
});
