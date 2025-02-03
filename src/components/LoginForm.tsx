// components/LoginForm.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ConfirmModal from './ConfirmModal';
import LoadingOverlay from './LoadingOverlay';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

const EmailSchema = Yup.object().shape({
    email: Yup.string().email('Неверный email').required('Введите email'),
});

interface LoginFormProps {
    onSendCode: (email: string) => void;
    isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSendCode, isLoading }) => {
    const navigation = useNavigation<NavigationProps>();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [emailValue, setEmailValue] = useState('');

    return (
        <View style={styles.formContainer}>
            <Text style={styles.title}>Войдите в аккаунт</Text>
            <Text style={styles.subtitle}>Добро пожаловать!</Text>
            <Formik
                initialValues={{ email: '' }}
                validationSchema={EmailSchema}
                onSubmit={({ email }) => {
                    setEmailValue(email);
                    setShowConfirmModal(true);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="example@gmail.com"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.error}>{errors.email}</Text>
                        )}
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                                if (errors.email) {
                                    Alert.alert('Ошибка', errors.email);
                                    return;
                                }
                                handleSubmit();
                            }}
                            disabled={isLoading}
                        >
                            <Text style={styles.submitButtonText}>
                                {isLoading ? 'Загрузка...' : 'Отправить код'}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.loginLinkContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.loginLink}>
                                    Еще нет аккаунта?{' '}
                                    <Text style={styles.loginText}>Зарегистрироваться</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <ConfirmModal
                            visible={showConfirmModal}
                            onClose={() => setShowConfirmModal(false)}
                            onConfirm={() => {
                                setShowConfirmModal(false);
                                onSendCode(emailValue);
                            }}
                            title="Внимание!"
                            message="Убедитесь, что Вы верно ввели адрес эл. почты."
                        />
                        {isLoading && <LoadingOverlay visible={true} />}
                    </>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 24,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: 'Outfit',
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Outfit',
        fontWeight: '400',
        color: '#000',
        textAlign: 'center',
        width: 208,
        marginBottom: 24,
        lineHeight: 24,
    },
    label: {
        marginBottom: 8,
        fontFamily: 'Outfit',
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        alignSelf: 'flex-start',
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
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 12,
    },
    submitButton: {
        width: 328,
        backgroundColor: '#FFC72C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 24,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    loginLink: {
        fontSize: 13,
        color: '#666',
        fontFamily: 'Outfit',
    },
    loginText: {
        fontSize: 13,
        fontFamily: 'Outfit',
        fontWeight: '600',
        textDecorationLine: 'underline',
        color: '#000',
    },
});

export default LoginForm;
