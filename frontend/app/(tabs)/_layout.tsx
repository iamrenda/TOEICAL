import Colors from "@/constants/Colors";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
    return (
        <NativeTabs tintColor={Colors.primary600}>
            <NativeTabs.Trigger name="home">
                <Label>ホーム</Label>
                <Icon sf={{ default: "house", selected: "house.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="history">
                <Label>履歴</Label>
                <Icon sf={{ default: "list.clipboard", selected: "list.clipboard.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="battle">
                <Label>対戦</Label>
                <Icon sf={{ default: "gamecontroller", selected: "gamecontroller.fill" }} />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <Label>プロフィール</Label>
                <Icon sf={{ default: "person.crop.circle", selected: "person.crop.circle.fill" }} />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
