import React from "react";
import Variables from "@/constants/Variables";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import useSettingsStore from "@/store/useSettingsStore";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Href, Link } from "expo-router";

interface GameModeDetails {
    href: Href;
    icon: string;
    title: string;
    subTitle: string;
    isTabVisible: boolean;
}

const gamemodes: GameModeDetails[] = [
    {
        href: "/(tabs)/(reading)",
        icon: "book-open",
        title: "リーディング",
        subTitle: "TOEICの問題を解いて実力をつけよう！",
        isTabVisible: true,
    },
    {
        href: "/(tabs)/writing",
        icon: "pencil",
        title: "ライティング",
        subTitle: "一日一回英文を書いてみよう！",
        isTabVisible: false,
    },
    {
        href: "/(tabs)/speaking",
        icon: "microphone",
        title: "スピーキング",
        subTitle: "即興で英語を話してみよう！",
        isTabVisible: false,
    },
];

const GamemodeItem = ({ gamemode }: { gamemode: GameModeDetails }) => {
    const { setTabsVisibility } = useSettingsStore();

    return (
        <Link href={gamemode.href} push asChild>
            <Pressable style={styles.button} onPress={() => setTabsVisibility(gamemode.isTabVisible)}>
                <FontAwesome6 name={gamemode.icon} size={16} color={Variables.primary600} style={styles.buttonIcon} />
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

export { GamemodeList };

const styles = StyleSheet.create({
    gamemodeTitle: {
        color: Variables.textPrimary,
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
        backgroundColor: Variables.white,
        borderRadius: Variables.borderRadiusPrimary,
        borderWidth: 2,
        borderColor: Variables.border,
        borderStyle: "dotted",
    },
    buttonIcon: {
        backgroundColor: Variables.primary100,
        padding: 12,
        marginRight: 12,
        borderRadius: Variables.borderRadiusPrimary,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: "600",
        paddingBottom: 2,
    },
    buttonSubtitle: {
        color: Variables.textSecondary,
    },
    buttonRightIcon: {
        marginLeft: "auto",
    },
});
