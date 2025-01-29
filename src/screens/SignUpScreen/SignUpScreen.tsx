import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import * as Yup from 'yup';
import { NavigationProps } from '../../navigation/types';

const SignUpSchema = Yup.object().shape({
    lastName: Yup.string().required('Фамилия обязательна'),
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string(),
    phone: Yup.string()
        .matches(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, 'Некорректный номер')
        .required('Номер телефона обязателен'),
    email: Yup.string().email('Некорректный email').required('Email обязателен'),
    subject: Yup.string().required('Выберите предмет'),
});

const SignUpScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header with two circles + logo */}
                    <View style={styles.headerContainer}>
                        {/* Circle 1*/}
                        <View style={styles.circle1} />

                        {/* Circle 2*/}
                        <View style={styles.circle2} />

                        {/* AK-logo*/}
                        <Image
                            source={require('../../../assets/images/AK-logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Form container */}
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Регистрация</Text>
                        <Text style={styles.subtitle}>
                            Пожалуйста, заполните необходимые данные!
                        </Text>

                        <Formik
                            initialValues={{
                                lastName: '',
                                firstName: '',
                                middleName: '',
                                phone: '',
                                email: '',
                                subject: '',
                            }}
                            validationSchema={SignUpSchema}
                            onSubmit={(values) => {
                                console.log(values);
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                setFieldValue,
                            }) => (
                                <View>
                                    {/* Фамилия */}
                                    <Text style={styles.label}>Фамилия</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Введите фамилию"
                                        onChangeText={handleChange('lastName')}
                                        onBlur={handleBlur('lastName')}
                                        value={values.lastName}
                                    />
                                    {touched.lastName && errors.lastName && (
                                        <Text style={styles.error}>{errors.lastName}</Text>
                                    )}

                                    {/* Имя */}
                                    <Text style={styles.label}>Имя</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Введите имя"
                                        onChangeText={handleChange('firstName')}
                                        onBlur={handleBlur('firstName')}
                                        value={values.firstName}
                                    />
                                    {touched.firstName && errors.firstName && (
                                        <Text style={styles.error}>{errors.firstName}</Text>
                                    )}

                                    {/* Отчество (необязательно) */}
                                    <Text style={styles.label}>Отчество</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Введите отчество"
                                        onChangeText={handleChange('middleName')}
                                        onBlur={handleBlur('middleName')}
                                        value={values.middleName}
                                    />

                                    {/* Телефон */}
                                    <Text style={styles.label}>Номер телефона</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="+7 (999) 959-99-99"
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        value={values.phone}
                                        keyboardType="phone-pad"
                                    />
                                    {touched.phone && errors.phone && (
                                        <Text style={styles.error}>{errors.phone}</Text>
                                    )}

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
                                    {touched.email && errors.email && (
                                        <Text style={styles.error}>{errors.email}</Text>
                                    )}

                                    <View style={styles.pickerContainer}>
                                        <RNPickerSelect
                                            placeholder={{
                                                label: 'Выберите предмет',
                                                value: '',
                                                color: '#999'
                                            }}
                                            onValueChange={(value) => setFieldValue('subject', value)}
                                            items={[
                                                { label: 'Сольфеджио', value: 'solfeggio' },
                                                { label: 'Актерское мастерство', value: 'acting' },
                                                { label: 'Вокал', value: 'vocal' },
                                            ]}
                                            style={{
                                                inputIOS: {
                                                    color: 'black',
                                                    fontSize: 16,
                                                    paddingVertical: 12,
                                                    paddingHorizontal: 12,
                                                    width: '100%',  // Full width
                                                },
                                                inputAndroid: {
                                                    color: 'black',
                                                },
                                                placeholder: {
                                                    color: '#999',
                                                },
                                            }}
                                            // iOS-specific fixes
                                            textInputProps={{
                                                pointerEvents: 'none',  // Allow parent to handle touches
                                            }}
                                            fixAndroidTouchableBug={true}
                                            useNativeAndroidPickerStyle={false}
                                        />
                                    </View>


                                    {touched.subject && errors.subject && (
                                        <Text style={styles.error}>{errors.subject}</Text>
                                    )}

                                    {/* Submit button */}
                                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit as any}>
                                        <Text style={styles.submitButtonText}>Отправить код</Text>
                                    </TouchableOpacity>

                                    {/* Login Link */}
                                    <TouchableOpacity
                                        style={styles.loginLinkContainer}
                                        onPress={() => navigation.navigate('Login')}
                                    >
                                        <Text style={styles.loginLink}>
                                            Уже есть аккаунт? <Text style={styles.loginText}>Войти</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpScreen;

/* -------------- STYLES -------------- */
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
        backgroundColor: '#FCD24E',
        opacity: 0.2,
    },
    circle2: {
        position: 'absolute',
        width: 342,
        height: 342,
        borderRadius: 342 / 2,
        top: -134,
        left: 209,
        backgroundColor: '#FCD24E',
        opacity: 0.2,
    },
    logo: {
        position: 'absolute',
        width: 289,
        height: 121,
        top: 110,
        left: 53,
    },
    formContainer: {
        paddingHorizontal: 24,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Регистрация
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginBottom: 8,
    },

    // Пожалуйста, заполните необходимые данные!
    subtitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000',
        textAlign: 'center',
        width: 208,
        marginBottom: 24,
        lineHeight: 24,
        alignSelf: 'center',
    },

    // Labels for input fields
    label: {
        marginBottom: 8,
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    input: {
        width: 328,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        fontSize: 15,
    },

    // Picker
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


    // Error messages for validation
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

    // Уже есть аккаунт?
    loginLink: {
        fontSize: 18,
        color: '#666',
    },

    // Войти
    loginText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});
