import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const Home = () => {
    return (
        <View style={styles.conatiner}>
            <View style={styles.greetContainer}>
                <Text style={styles.greetTitle}>おはよう、アレックス</Text>
                <Text style={styles.greetSubtitle}>今日も練習を始めましょう。</Text>
            </View>

            <View>
                <Text style={styles.gamemodeTitle}>学習モード</Text>

                <View style={styles.buttonContainer}>
                    <Link href="/home/refresh" push asChild>
                        <Pressable style={styles.button}>
                            <FontAwesome6
                                name="book-open"
                                size={16}
                                color={Colors.primary600}
                                style={styles.buttonIcon}
                            />
                            <View>
                                <Text style={styles.buttonTitle}>リフレッシュ</Text>
                                <Text style={styles.buttonSubtitle}>スターした問題を振り返ろう！</Text>
                            </View>
                            <FontAwesome6 name="angle-right" style={styles.buttonRightIcon} />
                        </Pressable>
                    </Link>
                    <Pressable style={styles.button}>
                        <FontAwesome6
                            name="pen-to-square"
                            size={16}
                            color={Colors.primary600}
                            style={styles.buttonIcon}
                        />
                        <View>
                            <Text style={styles.buttonTitle}>ソロクイズ</Text>
                            <Text style={styles.buttonSubtitle}>問題を自分で取り組んでみよう！</Text>
                        </View>
                        <FontAwesome6 name="angle-right" style={styles.buttonRightIcon} />
                    </Pressable>
                    <Pressable style={styles.button}>
                        <FontAwesome6 name="gamepad" size={16} color={Colors.primary600} style={styles.buttonIcon} />
                        <View>
                            <Text style={styles.buttonTitle}>対戦バトル</Text>
                            <Text style={styles.buttonSubtitle}>ほかのユーザーと競い合おう！</Text>
                        </View>
                        <FontAwesome6 name="angle-right" style={styles.buttonRightIcon} />
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    conatiner: {
        paddingVertical: 36,
        paddingHorizontal: 24,
    },

    greetContainer: {
        paddingBottom: 64,
    },
    greetTitle: {
        color: Colors.gray700,
        fontWeight: "600",
        fontSize: 28,
        paddingBottom: 2,
    },
    greetSubtitle: {
        color: Colors.gray500,
        fontSize: 16,
    },

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
        color: Colors.gray500,
    },
    buttonRightIcon: {
        marginLeft: "auto",
    },
});
