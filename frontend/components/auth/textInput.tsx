import Variables from "@/constants/Variables";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
    control: any;
    name: string;
    label: string;
    requirements?: string;
    style?: any;
    rules?: any;
    [x: string]: any;
}

const FormInput = ({ control, name, label, requirements, style, rules, ...textInputProps }: Props) => (
    <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={style}>
                <Text style={styles.label}>{label}</Text>

                <TextInput
                    style={[styles.input, error && styles.errorInput]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    accessibilityLabel={label}
                    {...textInputProps}
                />

                {requirements && !error && <Text style={styles.requirements}>{requirements}</Text>}
                {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
        )}
    />
);

export default FormInput;

const styles = StyleSheet.create({
    label: {
        fontWeight: "500",
        color: Variables.textPrimary,
        fontSize: 14,
        marginBottom: 8,
    },
    requirements: {
        color: Variables.textTertiary,
        fontSize: 12,
        paddingTop: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: Variables.border,
        borderRadius: Variables.borderRadiusPrimary,
        padding: 12,
        fontSize: 16,
        width: "100%",
    },
    errorInput: {
        borderColor: Variables.error,
    },
    errorText: {
        color: Variables.error,
        marginTop: 4,
    },
});
