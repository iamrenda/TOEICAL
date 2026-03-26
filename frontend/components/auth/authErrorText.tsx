import { StyleSheet, Text } from "react-native";
import Variables from "@/constants/Variables";

interface Props {
    message?: string;
}

const ErrorText = ({ message }: Props) => {
    return <Text style={styles.errorText}>{message}</Text>;
};

export { ErrorText };

const styles = StyleSheet.create({
    errorText: {
        color: Variables.error,
        marginBottom: 8,
    },
});
