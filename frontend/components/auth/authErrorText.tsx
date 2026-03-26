import { StyleSheet, Text } from "react-native";
import Variables from "@/constants/Variables";

interface Props {
    message?: string;
}

const AuthErrorText = ({ message }: Props) => {
    return <Text style={styles.errorText}>{message}</Text>;
};

export { AuthErrorText };

const styles = StyleSheet.create({
    errorText: {
        color: Variables.error,
        marginBottom: 8,
    },
});
