import Variables from "@/constants/Variables";
import useAuthStore from "@/store/useAuthStore";
import useSettingsStore from "@/store/useSettingsStore";
import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { ActivityIndicator, View } from "react-native";

function TabLayout() {
    const { isLoading, isLoggedIn } = useAuthStore();
    const { isTabsHidden } = useSettingsStore();

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
        <NativeTabs tintColor={Variables.primary600} hidden={isTabsHidden}>
            <NativeTabs.Trigger name="(home)">
                <NativeTabs.Trigger.Label>ホーム</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(review)">
                <NativeTabs.Trigger.Label>復習</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="list.clipboard.fill" md="list" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="quiz">
                <NativeTabs.Trigger.Label>クイズ</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="gamecontroller.fill" md="gamepad" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="speaking">
                <NativeTabs.Trigger.Label>スピーキング</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="mic.fill" md="mic" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>プロフィール</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="person.circle.fill" md="person" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}

export default TabLayout;
