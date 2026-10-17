import Variables from "@/constants/Variables";
import useAuthStore from "@/store/useAuthStore";
import { NativeTabs } from "expo-router/unstable-native-tabs";
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
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(reading)">
                <NativeTabs.Trigger.Label>Reading</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="list.clipboard.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(writing)">
                <NativeTabs.Trigger.Label>Writing</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="pencil.line" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person.circle.fill" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default TabLayout;
