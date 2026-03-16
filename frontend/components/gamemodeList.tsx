import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
import { Href, Link } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";

interface GameModeDetails {
    href: Href;
    icon: string;
    title: string;
    subTitle: string;
}

const gamemodes: GameModeDetails[] = [
    {
        href: "/home/refresh",
        icon: "book-open",
        title: "リフレッシュ",
        subTitle: "間違えた問題を振り返ろう！",
    },
    {
        href: "",
        icon: "pen-to-square",
        title: "ソロクイズ",
        subTitle: "問題を自分で取り組んでみよう！",
    },
    {
        href: "",
        icon: "gamepad",
        title: "対戦バトル",
        subTitle: "ほかのユーザーと競い合おう！",
    },
];

const GamemodeItem = ({ gamemode }: { gamemode: GameModeDetails }) => {
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

const GamemodeList = () => {
    return (
        <View>
            <Text style={styles.gamemodeTitle}>学習モード</Text>

            <View style={styles.buttonContainer}>
                {gamemodes.map((gamemode, i) => (
                    <GamemodeItem gamemode={gamemode} key={i} />
                ))}
            </View>
        </View>
    );
};

export default GamemodeList;

const styles = StyleSheet.create({
    gamemodeTitle: {
        color: Colors.textPrimary,
        fontSize: 18,
        fontWeight: "600",
        paddingLeft: 4,
        paddingBottom: 8,
    },
    buttonContainer: {
        gap: 8,
    },

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
