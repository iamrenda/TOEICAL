import Variables from "@/constants/Variables";
import useAuthStore from "@/store/useAuthStore";
import showAlert from "@/util/alert";
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SubmitHandler, useForm } from "react-hook-form";
import { LoginErrorType, loginErrorMessages } from "@/types/error";
import { router } from "expo-router";
import { AuthHeader, FormInput, CustomButton, AuthFooter, ErrorText } from "@/components";

interface Inputs {
    email: string;
    password: string;
}

const Login = () => {
    const {
        handleSubmit,
        control,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<Inputs>();
    const { login, isLoading } = useAuthStore();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { email, password } = data;
        const res = await login(email, password);

        clearErrors();

        if (res.success) {
            router.replace("/");
            return;
        }

        const { errorType } = res;

        switch (errorType) {
            case LoginErrorType.INVALID_CREDENTIALS:
                setError("root", { message: loginErrorMessages[errorType] });
                break;

            case LoginErrorType.TOO_MANY_ATTEMPTS:
            case LoginErrorType.NETWORK_ERROR:
            case LoginErrorType.SERVER_ERROR:
                showAlert("ログインエラー", loginErrorMessages[errorType]);
                break;

            default:
                showAlert("ログインエラー", "不明なエラーが発生しました。もう一度お試しください。");
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Variables.white }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always" keyboardDismissMode="interactive">
                    <View style={styles.container}>
                        <AuthHeader />

                        <View>
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
                                rules={{ required: "This is required" }}
                                secureTextEntry
                                style={styles.formInput}
                            />

                            {errors.root && <ErrorText message={errors.root.message} />}
                            <CustomButton
                                text="ログイン"
                                onPress={handleSubmit(onSubmit)}
                                iconName="arrow-right"
                                isDisabled={false}
                                style={styles.formButton}
                                isLoading={isLoading}
                            />
                        </View>

                        <AuthFooter text="アカウントをお持ちでないですか？ " linkLabel="新規登録" linkDir="/signup" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 86,
        paddingHorizontal: 24,
        backgroundColor: Variables.white,
    },
    formInput: {
        marginBottom: 16,
    },
    formButton: {
        marginTop: 16,
        marginBottom: 16,
    },
});
