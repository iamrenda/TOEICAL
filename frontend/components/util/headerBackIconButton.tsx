import { StyleSheet, Pressable, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
    iconName: string;
    onPress?: () => void;
}

const HeaderBackIconButton = ({ iconName, onPress }: Props) => {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        }
        router.back();
    };

    return (
        <Pressable onPress={handlePress} style={styles.pressable}>
            <View style={styles.button}>
                <FontAwesome6 name={iconName} size={24} color="black" />
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
