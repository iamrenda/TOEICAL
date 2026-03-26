import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable } from "react-native";

interface Props {
    iconName: string;
}

const HeaderBackIconButton = ({ iconName }: Props) => {
    return (
        <Link href=".." asChild>
            <Pressable>
                <FontAwesome6 name={iconName} size={24} color="black" />
            </Pressable>
        </Link>
    );
};

export { HeaderBackIconButton };
