import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface SignupVerificationFormProps {
    code: string;
    onChangeCode: (code: string) => void;
    onGoBack: () => void;
    onVerify: () => void;
}

const SignupVerificationForm: React.FC<SignupVerificationFormProps> = ({
    code,
    onChangeCode,
    onGoBack,
    onVerify,
}) => {
    return (
        <View style={styles.formContainer}>
            <Text style={styles.verificationText}>Введите код, отправленный на почту</Text>
            <Text style={styles.codeLabel}>Код</Text>
            <TextInput
                value={code}
                onChangeText={onChangeCode}
                keyboardType="numeric"
                style={styles.input}
                placeholder="Введите код"
                maxLength={6}
                textAlign="center"
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Text style={styles.backButtonText}>Назад</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.verifyButton} onPress={onVerify}>
                    <Text style={styles.verifyButtonText}>Войти</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 24,
        marginTop: 30,
        alignItems: 'center',
    },
    verificationText: {
        fontSize: 24,
        fontFamily: 'Outfit',
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginBottom: 15,
    },
    codeLabel: {
        alignSelf: 'flex-start',
        marginTop: 20,
        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        width: 328,
        borderWidth: 0.6,
        borderColor: '#6C6A6A',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        fontSize: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 328,
        marginTop: 30,
    },
    backButton: {
        width: 148,
        height: 45,
        backgroundColor: '#FFC67C',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 18,
        fontFamily: 'Outfit',
        fontWeight: '700',
        color: '#000',
    },
    verifyButton: {
        width: 148,
        height: 45,
        backgroundColor: '#FFE27D',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    verifyButtonText: {
        fontSize: 18,
        fontFamily: 'Outfit',
        fontWeight: '700',
        color: '#000',
    },
});

export default SignupVerificationForm;
