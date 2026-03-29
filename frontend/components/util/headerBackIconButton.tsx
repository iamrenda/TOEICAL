import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

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
        <Pressable onPress={handlePress}>
            <FontAwesome6 name={iconName} size={24} color="black" />
        </Pressable>
    );
};

export { HeaderBackIconButton };
