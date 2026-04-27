import Variables from "@/constants/Variables";
import useAuthStore from "@/store/useAuthStore";
import { SymbolView } from "expo-symbols";
import { Redirect, Tabs } from "expo-router";
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
        <Tabs
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Variables.primary600,
            }}
        >
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <SymbolView name="house.fill" tintColor={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="(reading)"
                options={{
                    title: "Reading",
                    tabBarIcon: ({ color, size }) => (
                        <SymbolView name="list.clipboard.fill" tintColor={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="writing"
                options={{
                    title: "Writing",
                    tabBarIcon: ({ color, size }) => <SymbolView name="pencil.line" tintColor={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="speaking"
                options={{
                    title: "Speaking",
                    tabBarIcon: ({ color, size }) => <SymbolView name="mic.fill" tintColor={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <SymbolView name="person.circle.fill" tintColor={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabLayout;
