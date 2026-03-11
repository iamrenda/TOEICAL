import Colors from "@/constants/Colors";
import { GameModeDetails } from "@/components/gamemodes/gamemode";
import { FontAwesome6 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View, Text } from "react-native";

interface Props {
    gamemode: GameModeDetails;
}

const GamemodeItem = ({ gamemode }: Props) => {
    return (
        <Link href={gamemode.href} push asChild>
            <Pressable style={styles.button}>
                <FontAwesome6 name={gamemode.icon} size={16} color={Colors.primary600} style={styles.buttonIcon} />
                <View>
                    <Text style={styles.buttonTitle}>{gamemode.title}</Text>
                    <Text style={styles.buttonSubtitle}>{gamemode.subTitle}</Text>
                </View>
                <FontAwesome6 name="angle-right" style={styles.buttonRightIcon} />
            </Pressable>
        </Link>
    );
};

export default GamemodeItem;

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 16,
        paddingVertical: 18,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.gray0,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.border,
        borderStyle: "dotted",
    },
    buttonIcon: {
        backgroundColor: Colors.primary100,
        padding: 12,
        marginRight: 12,
        borderRadius: 10,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: "600",
        paddingBottom: 2,
    },
    buttonSubtitle: {
        color: Colors.textSecondary,
    },
    buttonRightIcon: {
        marginLeft: "auto",
    },
});
