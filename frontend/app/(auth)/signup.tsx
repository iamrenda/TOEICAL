import { ScrollView, StyleSheet, View, KeyboardAvoidingView } from "react-native";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Variables from "@/constants/Variables";
import FormInput from "@/components/auth/textInput";
import CustomButton from "@/components/util/customButton";
import AuthFooter from "@/components/auth/authFooter";
import AuthHeader from "@/components/auth/header";
import useAuthStore from "@/store/useAuthStore";
import { SafeAreaView } from "react-native-safe-area-context";

interface Inputs {
    username: string;
    email: string;
    password: string;
}

const Signup = () => {
    const { handleSubmit, control } = useForm<Inputs>();
    const { isLoading, signUp } = useAuthStore();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { username, email, password } = data;

        await signUp(username, email, password);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Variables.white }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always" keyboardDismissMode="interactive">
                    <View style={styles.container}>
                        <AuthHeader />

                        <View style={styles.formContainer}>
                            <FormInput
                                control={control}
                                name="username"
                                label="Username"
                                requirements="英子文字のみ（スペースなし）"
                                style={styles.formInput}
                                rules={{ required: "この項目は必須です" }}
                            />
                            <FormInput
                                control={control}
                                name="email"
                                label="Email"
                                rules={{
                                    required: "この項目は必須です",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "無効なメールアドレスです",
                                    },
                                }}
                                style={styles.formInput}
                            />
                            <FormInput
                                control={control}
                                name="password"
                                label="Password"
                                requirements="6文字以上、大文字、小文字、数字を含めてください"
                                rules={{
                                    required: "この項目は必須です",
                                    minLength: { value: 6, message: "パスワードは6文字以上である必要があります" },
                                    maxLength: { value: 128, message: "パスワードは128文字以下である必要があります" },
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                        message: "パスワードは大文字、小文字、数字を含める必要があります",
                                    },
                                }}
                                secureTextEntry
                                style={styles.formInput}
                            />
                            <CustomButton
                                text="新規作成"
                                onPress={handleSubmit(onSubmit)}
                                iconName="arrow-right"
                                isDisabled={false}
                                isLoading={isLoading}
                                style={styles.formButton}
                            />
                        </View>

                        <AuthFooter text="既にアカウントをお持ちですか？" linkLabel="ログイン" linkDir="/login" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 56,
        paddingHorizontal: 24,
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
