import { HeaderBackIconButton } from "@/components";
import { router, Stack } from "expo-router";
import { Text, Pressable, StyleSheet, Alert } from "react-native";
import Variables from "@/constants/Variables";

const WritingLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="[topicId]"
                options={{
                    headerTitle: "",
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <HeaderBackIconButton
                            iconName="xmark"
                            shouldGoBack={false}
                            onPress={() => {
                                Alert.alert("ライティングモードを終了しますか？", "書いてある内容は失われます。", [
                                    { text: "閉じる", style: "cancel" },
                                    { text: "終了する", style: "destructive", onPress: () => router.back() },
                                ]);
                            }}
                        />
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={() => {
                                Alert.alert("提出しますか？", "提出後は内容を変更できません。", [
                                    { text: "キャンセル", style: "cancel" },
                                    {
                                        text: "提出する",
                                        style: "default",
                                        onPress: () => router.replace("/(writing)/result"),
                                    },
                                ]);
                            }}
                            style={styles.finishButton}
                        >
                            <Text style={styles.finishText}>提出</Text>
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen
                name="aiEssayModal"
                options={{
                    presentation: "modal",
                    headerTitle: "",
                    animation: "slide_from_bottom",
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: "#0D1425" },
                    headerLeft: () => <HeaderBackIconButton iconName="xmark" iconColor="white" />,
                }}
            />
            <Stack.Screen
                name="result"
                options={{
                    headerShadowVisible: false,
                    headerTitle: "",
                    headerLeft: () => <HeaderBackIconButton iconName="xmark" onPress={() => router.back()} />,
                }}
            />
        </Stack>
    );
};

export default WritingLayout;

const styles = StyleSheet.create({
    finishButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Variables.primary600,
    },
    finishText: {
        fontSize: 14,
        fontWeight: "700",
        color: Variables.white,
    },
});
