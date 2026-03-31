import { Alert } from "react-native";

interface AlertContent {
    title?: string;
    message: string;
}

const showErrorAlert = (alert: AlertContent) => {
    const { title = "エラー", message } = alert;
    Alert.alert(title, message, [{ text: "閉じる" }]);
};

export default showErrorAlert;
