import Variables from "@/constants/Variables";
import { StyleSheet, Text } from "react-native";

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
