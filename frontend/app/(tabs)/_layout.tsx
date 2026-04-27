import Variables from "@/constants/Variables";
import useAuthStore from "@/store/useAuthStore";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

function TabLayout() {
    const { isLoading, isLoggedIn } = useAuthStore();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color={Variables.primary600} />
            </View>
        );
    }

    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return (
        <NativeTabs tintColor={Variables.primary600} backBehavior="history">
            <NativeTabs.Trigger name="index">
                <Label>Home</Label>
                <Icon sf="house.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(reading)">
                <Label>Reading</Label>
                <Icon sf="list.clipboard.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="writing">
                <Label>Writing</Label>
                <Icon sf="pencil.line" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="speaking">
                <Label>Speaking</Label>
                <Icon sf="mic.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <Label>Profile</Label>
                <Icon sf="person.circle.fill" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default TabLayout;
