import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { useForm, SubmitHandler } from "react-hook-form";
import Variables from "@/constants/Variables";
import FormInput from "@/components/auth/textInput";
import CustomButton from "@/components/util/customButton";
import AuthFooter from "@/components/auth/authFooter";

interface Inputs {
    username: string;
    email: string;
    password: string;
}

const Signup = () => {
    const { handleSubmit, control } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <FontAwesome6 name="graduation-cap" size={24} color={Variables.white} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>TOEICAL</Text>
                <Text style={styles.headerSubtitle}>TOEICから始める英語学習アプリ</Text>
            </View>

            <View style={styles.formContainer}>
                <FormInput
                    control={control}
                    name="username"
                    label="Username"
                    requirements="英子文字のみ（スペースなし）"
                    style={styles.formInput}
                    rules={{ required: "This is required" }}
                />
                <FormInput
                    control={control}
                    name="email"
                    label="Email"
                    rules={{ required: "This is required" }}
                    style={styles.formInput}
                />
                <FormInput
                    control={control}
                    name="password"
                    label="Password"
                    requirements="大文字、小文字、数字を含めてください"
                    rules={{ required: "This is required" }}
                    secureTextEntry
                    style={styles.formInput}
                />

                <CustomButton
                    text="Sign Up"
                    onPress={handleSubmit(onSubmit)}
                    iconName="arrow-right"
                    isDisabled={false}
                    style={styles.formButton}
                />
            </View>

            <AuthFooter text="既にアカウントをお持ちですか？" linkLabel="ログイン" linkDir="/login" />
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Variables.white,
        paddingHorizontal: 24,
        paddingTop: 56,
    },

    headerContainer: {
        alignItems: "center",
        marginBottom: 36,
    },
    headerIcon: {
        marginBottom: 8,
        backgroundColor: Variables.primary600,
        borderRadius: Variables.borderRadiusPrimary,
        padding: 10,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: "700",
        color: Variables.primary600,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: Variables.textTertiary,
    },

    formContainer: {
        width: "100%",
    },
    formInput: {
        marginBottom: 16,
    },
    formButton: {
        marginTop: 16,
        marginBottom: 16,
    },
});
