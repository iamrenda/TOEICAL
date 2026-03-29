import { Modal, Text, Pressable, View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface Props {
    visible: boolean;
    value: number;
    onClose: () => void;
    setValue: (value: number) => void;
}

const QuestionNumberPickerModal = ({ visible, onClose, value, setValue }: Props) => {
    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={styles.flexFill} onPress={onClose} />

                <View style={styles.pickerContainer}>
                    <View style={styles.header}>
                        <Pressable onPress={onClose} hitSlop={20}>
                            <Text style={styles.closeBtn}>閉じる</Text>
                        </Pressable>
                    </View>

                    <Picker
                        selectedValue={value}
                        onValueChange={setValue}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="10問" value={10} />
                        <Picker.Item label="20問" value={20} />
                        <Picker.Item label="30問" value={30} />
                    </Picker>
                </View>
            </View>
        </Modal>
    );
};

export { QuestionNumberPickerModal };

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Dims the background
        justifyContent: "flex-end", // Aligns the picker to the bottom
    },
    flexFill: {
        flex: 1,
    },
    pickerContainer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        paddingBottom: 30, // Extra padding for home indicator on newer iPhones
    },
    header: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#E2E2E2",
        alignItems: "flex-end",
    },
    closeBtn: {
        color: "#007AFF", // System Blue
        fontSize: 17,
        fontWeight: "600",
    },
    picker: {
        width: "100%",
    },
    pickerItem: {
        fontSize: 22,
        color: "#000",
    },
});
