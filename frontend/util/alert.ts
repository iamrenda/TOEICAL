import { Alert } from "react-native";

const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: "閉じる" }]);
};

export default showAlert;
