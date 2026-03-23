import { StyleSheet, View } from "react-native";
import React from "react";
import AuthHeader from "@/components/auth/header";
import { SafeAreaView } from "react-native-safe-area-context";
import Variables from "@/constants/Variables";
import FormInput from "@/components/auth/textInput";
import CustomButton from "@/components/util/customButton";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFooter from "@/components/auth/authFooter";

interface Inputs {
    email: string;
    password: string;
}

const Login = () => {
    const { handleSubmit, control } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data);
    };

    return (
        <SafeAreaView style={styles.container}>
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

                <CustomButton
                    text="ログイン"
                    onPress={handleSubmit(onSubmit)}
                    iconName="arrow-right"
                    isDisabled={false}
                    style={styles.formButton}
                />
            </View>

            <AuthFooter text="アカウントをお持ちでないですか？ " linkLabel="新規登録" linkDir="/signup" />
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
