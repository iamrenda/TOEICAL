import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GamemodeItem from "./gamemodeItem";
import { GameModeDetails } from "@/components/gamemodes/gamemode";
import Colors from "@/constants/Colors";

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
        color: Colors.gray700,
        fontSize: 18,
        fontWeight: "600",
        paddingLeft: 4,
        paddingBottom: 8,
    },
    buttonContainer: {
        gap: 8,
    },
});
