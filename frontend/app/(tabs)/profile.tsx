import useAuthStore from "@/store/useAuthStore";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
    const { logout } = useAuthStore();

    return (
        <SafeAreaView>
            <Button title="Logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({});
