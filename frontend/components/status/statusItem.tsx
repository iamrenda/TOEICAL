import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { Status } from "@/components/status/status";

interface Props {
    status: Status;
}

const StatusItem = ({ status }: Props) => {
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

export default StatusItem;

const styles = StyleSheet.create({
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
