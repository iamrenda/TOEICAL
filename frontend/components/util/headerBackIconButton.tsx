import { StyleSheet, Pressable, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";

interface Props {
    iconName: string;
    shouldGoBack?: boolean;
    onPress?: () => void;
    iconColor?: string;
}

const HeaderBackIconButton = ({ iconName, shouldGoBack = true, onPress, iconColor = "black" }: Props) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        }

        if (shouldGoBack) {
            router.back();
        }
    };

    return (
        <Pressable onPress={handlePress} style={styles.pressable}>
            <View style={styles.button}>
                <FontAwesome6 name={iconName} size={24} color={iconColor} />
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    pressable: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export { HeaderBackIconButton };
