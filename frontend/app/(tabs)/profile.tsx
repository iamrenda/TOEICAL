import useAuthStore from "@/store/useAuthStore";
import { Button, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
    const { logout } = useAuthStore();

    return (
        <SafeAreaView>
            <Button title="Logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
