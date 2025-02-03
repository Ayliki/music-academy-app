import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

export interface SignupFormValues {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email: string;
    selection: string;
}

const SignUpSchema = Yup.object().shape({
    lastName: Yup.string().required('Фамилия обязательна'),
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string(),
    phone: Yup.string()
        .matches(/^\+7\d{10}$/, 'Некорректный номер')
        .required('Номер телефона обязателен'),
    email: Yup.string().email('Некорректный email').required('Email обязателен'),
    selection: Yup.string().required('Пожалуйста, сделайте выбор'),
});

interface SignupFormProps {
    initialValues: SignupFormValues;
    onSubmit: (values: SignupFormValues) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ initialValues, onSubmit }) => {
    const navigation = useNavigation<NavigationProps>();
    // To toggle labels for teacher vs. parent
    const [isTeacher, setIsTeacher] = useState(false);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
                <Text style={styles.title}>Регистрация</Text>
                <Text style={styles.subtitle}>Пожалуйста, заполните необходимые данные!</Text>
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={SignUpSchema}
                    onSubmit={onSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <View>
                            {/* Фамилия */}
                            <Text style={styles.label}>{isTeacher ? 'Фамилия' : 'Фамилия ребенка'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Введите фамилию"
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                value={values.lastName}
                            />
                            {touched.lastName && errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}

                            {/* Имя */}
                            <Text style={styles.label}>{isTeacher ? 'Имя' : 'Имя ребенка'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Введите имя"
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                value={values.firstName}
                            />
                            {touched.firstName && errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}

                            {/* Отчество */}
                            <Text style={styles.label}>
                                {isTeacher ? 'Отчество' : 'Отчество ребенка (при наличии)'}
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Введите отчество"
                                onChangeText={handleChange('middleName')}
                                onBlur={handleBlur('middleName')}
                                value={values.middleName}
                            />

                            {/* Телефон */}
                            <Text style={styles.label}>
                                {isTeacher ? 'Номер телефона' : 'Номер телефона родителя'}
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+7 (999) 959-99-99"
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                keyboardType="phone-pad"
                            />
                            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                            {/* Email */}
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
                            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                            {/* Picker */}
                            <View style={styles.pickerContainer}>
                                <RNPickerSelect
                                    placeholder={{
                                        label: isTeacher ? 'Выберите предмет' : 'Выберите группу',
                                        value: '',
                                        color: '#999',
                                    }}
                                    onValueChange={(value) => setFieldValue('selection', value)}
                                    value={values.selection}
                                    items={
                                        isTeacher
                                            ? [
                                                { label: 'Сольфеджио', value: 'solfeggio' },
                                                { label: 'Актерское мастерство', value: 'acting' },
                                                { label: 'Вокал', value: 'vocal' },
                                            ]
                                            : [
                                                { label: 'Teens 1', value: 'Teens1' },
                                                { label: 'Teens 2', value: 'Teens2' },
                                                { label: 'Kids 1', value: 'Kids1' },
                                                { label: 'Kids 2', value: 'Kids2' },
                                                { label: 'Junior 1', value: 'Junior1' },
                                                { label: 'Junior 2', value: 'Junior2' },
                                                { label: 'Junior 3', value: 'Junior3' },
                                            ]
                                    }
                                    style={{
                                        inputIOS: {
                                            color: 'black',
                                            fontSize: 16,
                                            paddingVertical: 12,
                                            paddingHorizontal: 12,
                                            width: '100%',
                                        },
                                        placeholder: { color: '#999' },
                                    }}
                                    textInputProps={{ pointerEvents: 'none' }}
                                    fixAndroidTouchableBug={true}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>
                            {touched.selection && errors.selection && <Text style={styles.error}>{errors.selection}</Text>}

                            {/* Submit button */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit as any}>
                                <Text style={styles.submitButtonText}>Отправить код</Text>
                            </TouchableOpacity>

                            {/* Login Link */}
                            <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>
                                    Уже есть аккаунт? <Text style={styles.loginText}>Войти</Text>
                                </Text>
                            </TouchableOpacity>

                            {/* Toggle teacher */}
                            {!isTeacher && (
                                <TouchableOpacity onPress={() => setIsTeacher(true)}>
                                    <Text style={[styles.link, { marginTop: 10 }]}>Я педагог!</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 24,
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
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
    pickerContainer: {
        width: 328,
        height: 52,
        borderWidth: 2,
        borderColor: '#FFB400',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'center',
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
    },
    loginLink: {
        fontSize: 18,
        color: '#666',
    },
    loginText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline',
    },
    link: {
        fontFamily: 'Outfit',
        fontSize: 18,
        color: '#AB8104',
        fontWeight: '700',
        textAlign: 'center',
    },
});

export default SignupForm;
