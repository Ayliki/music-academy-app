import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { Formik } from 'formik';
import * as Yup from 'yup';

const EmailSchema = Yup.object().shape({
    email: Yup.string().email('Неверный email').required('Введите email'),
});

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProps>();

    const handleLogin = async (values: { email: string }) => {
        const { email } = values;
        console.log('Email submitted:', email);
        navigation.navigate('EnterCode', { email });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <Image source={require('../../assets/images/circle1.png')} style={styles.circle1} />
                <Image source={require('../../assets/images/circle2.png')} style={styles.circle2} />
                <Image source={require('../../assets/images/AK-logo.png')} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Войдите в аккаунт</Text>
                <Text style={styles.subtitle}>Добро пожаловать!</Text>

                <Formik initialValues={{ email: '' }} validationSchema={EmailSchema} onSubmit={handleLogin}>
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
                            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit as any}>
                                <Text style={styles.submitButtonText}>Отправить код</Text>
                            </TouchableOpacity>

                            <View style={styles.loginLinkContainer}>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                    <Text style={styles.loginLink}>
                                        Еще нет аккаунта? <Text style={styles.loginText}>Зарегистрироваться</Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 240,
        backgroundColor: '#fff',
    },
    circle1: {
        position: 'absolute',
        width: 445,
        height: 406,
        borderRadius: 406 / 2,
        top: -169,
        left: -35,
        backgroundColor: '#FFC600',
        opacity: 0.2,
    },
    circle2: {
        position: 'absolute',
        width: 342,
        height: 342,
        borderRadius: 342 / 2,
        top: -134,
        left: 209,
        backgroundColor: '#FFC600',
        opacity: 0.2,
    },
    logo: {
        position: 'absolute',
        width: 289,
        height: 121,
        top: 110,
        left: 53,
        resizeMode: 'contain',
    },
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
        alignSelf: 'center',
    },
    label: {
        marginBottom: 8,
        fontFamily: 'Outfit',
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 20.16,
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
        fontWeight: '400',
        lineHeight: 18.9,
        fontSize: 15,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: -8,
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
        fontWeight: '400',
        lineHeight: 16.38,
    },
    loginText: {
        fontSize: 13,
        fontFamily: 'Outfit',
        fontWeight: '600',
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        color: '#000',
    },
});

export default LoginScreen;
