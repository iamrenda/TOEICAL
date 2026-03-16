import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import Colors from "@/constants/Colors";

interface Status {
    color: string;
    icon: string;
    title: string;
    subTitle: string;
    status: string;
}

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

const StatusItem = ({ status }: { status: Status }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <FontAwesome6 name={status.icon} color={status.color} size={18} />
                <Text style={styles.title}>{status.title}</Text>
            </View>
            <Text style={styles.status}>{status.status}</Text>
            <Text style={[styles.subtitle, { color: status.color }]}>{status.subTitle}</Text>
        </View>
    );
};

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

    container: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: Colors.gray0,
        boxShadow: `0px 1px 2px ${Colors.shadow}`,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingBottom: 8,
    },
    title: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    status: {
        fontSize: 32,
        fontWeight: "600",
        color: Colors.textPrimary,
        paddingBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: "500",
    },
});
