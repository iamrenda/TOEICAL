import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import Variables from "@/constants/Variables";
import { QuestionNumberPickerModal, Footer, CustomButton } from "@/components";

const problemTypes = [
    { id: 1, title: "ランダム", subtitle: "こちらが決めちゃいますよ！", icon: "dice" },
    { id: 2, title: "お気に入りのみ", subtitle: "ブックマークした問題を解く", icon: "star" },
    { id: 3, title: "未回答のみ", subtitle: "まだ解いていない問題を解く", icon: "circle-question" },
    { id: 4, title: "間違えた問題のみ", subtitle: "過去のミスを復習する", icon: "circle-exclamation" },
];

const SoloQuizSettingsStack = () => {
    const [questionCount, setQuestionCount] = React.useState(20);
    const [isPickerVisible, setIsPickerVisible] = React.useState(false);
    const [selectedProblemType, setSelectedProblemType] = React.useState(1);

    return (
        <View style={styles.container}>
            <FontAwesome6 name="pen-to-square" size={24} style={styles.titleIcon} color={Variables.primary600} />
            <Text style={styles.titleText}>TOEICAL</Text>
            <Text style={styles.subtitleText}>Part 5 セッションの設定</Text>

            <View style={styles.questionCountSettingsContainer}>
                <View style={styles.questionSettingsTitleContainer}>
                    <FontAwesome6 name="list-ol" size={16} color={Variables.primary600} />
                    <Text style={styles.questionSettingsTitle}>問題数</Text>
                </View>
                <View>
                    <Pressable onPress={() => setIsPickerVisible(true)} style={styles.questionCountButton}>
                        <Text>{questionCount}</Text>
                        <FontAwesome6 name="angle-down" size={16} />
                    </Pressable>

                    <QuestionNumberPickerModal
                        visible={isPickerVisible}
                        onClose={() => setIsPickerVisible(false)}
                        value={questionCount}
                        setValue={setQuestionCount}
                    />
                </View>
            </View>
            <View style={styles.questionTypeSettingsContainer}>
                <View style={styles.questionSettingsTitleContainer}>
                    <FontAwesome6 name="shapes" size={16} color={Variables.primary600} />
                    <Text style={styles.questionSettingsTitle}>問題のタイプ</Text>
                </View>
                <View style={styles.questionTypesContainer}>
                    {problemTypes.map((type) => {
                        const isSelected = selectedProblemType === type.id;

                        return (
                            <View key={type.id} style={styles.questionTypeContainer}>
                                <FontAwesome6
                                    name={type.icon}
                                    size={20}
                                    color={isSelected ? Variables.primary600 : Variables.gray600}
                                    style={[styles.questionTypeIcon, isSelected && styles.selectedQuestionTypeIcon]}
                                />
                                <View style={styles.questionTypeTitleContainer}>
                                    <Text style={styles.questionTypeTitle}>{type.title}</Text>
                                    <Text style={styles.questionTypeSubtitle}>{type.subtitle}</Text>
                                </View>
                                <View>
                                    <Switch
                                        value={isSelected}
                                        onValueChange={() => setSelectedProblemType(type.id)}
                                        trackColor={{ false: Variables.gray300, true: Variables.primary600 }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            <Footer>
                <CustomButton
                    text="クイズ開始"
                    variant="primary"
                    iconName="angle-right"
                    isSelected={true}
                    onPress={() => console.log("Start Session")}
                    flex={1}
                />
            </Footer>
        </View>
    );
};

export default SoloQuizSettingsStack;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 32,
        backgroundColor: Variables.white,
    },

    titleIcon: {
        backgroundColor: Variables.primary100,
        padding: 12,
        marginBottom: 12,
        borderRadius: Variables.borderRadiusPrimary,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "800",
        color: Variables.textPrimary,
    },
    subtitleText: {
        fontSize: 18,
        color: Variables.textSecondary,
        marginBottom: 32,
    },

    questionCountSettingsContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    questionTypeSettingsContainer: {
        width: "100%",
        marginBottom: 20,
    },
    questionSettingsTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    questionSettingsTitle: {
        fontSize: 16,
        color: Variables.textPrimary,
        fontWeight: "500",
    },

    questionCountButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },

    questionTypesContainer: {
        marginTop: 12,
        flexDirection: "column",
        gap: 12,
    },
    questionTypeContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 18,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: Variables.border,
        borderRadius: Variables.borderRadiusSecondary,
    },
    questionTypeTitleContainer: {
        marginRight: "auto",
    },
    questionTypeIcon: {
        padding: 12,
        borderRadius: Variables.borderRadiusPrimary,
        backgroundColor: Variables.gray100,
    },
    selectedQuestionTypeIcon: {
        backgroundColor: Variables.primary100,
    },
    questionTypeTitle: {
        fontSize: 16,
        color: Variables.textPrimary,
        fontWeight: "700",
    },
    questionTypeSubtitle: {
        fontSize: 12,
        color: Variables.textSecondary,
    },
});
