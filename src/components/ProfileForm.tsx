import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UserProfile } from '../services/userService';

const ProfileSchema = Yup.object().shape({
    lastName: Yup.string().required('Фамилия обязательна'),
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string(),
    phone: Yup.string().matches(/^\+7\d{10}$/, 'Некорректный номер'),
    email: Yup.string().email('Некорректный email'),
});

interface ProfileFormProps {
    initialValues: UserProfile;
    onSubmit: (values: UserProfile) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialValues, onSubmit }) => {
    let buttonColor = '#9999FF'
    if (initialValues.role === 'teacher') {
        buttonColor = '#314FBB';
    } else if (initialValues.role === 'administrator') {
        buttonColor = '#4DD3BA';
    }
    return (
        <Formik initialValues={initialValues} validationSchema={ProfileSchema} onSubmit={onSubmit}>
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isSubmitting,
                dirty,
            }) => (
                <View style={styles.formContainer}>
                    <Text style={styles.label}>
                        {(initialValues.role === 'teacher' || initialValues.role === 'administrator') ? 'Фамилия' : 'Фамилия ребенка'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Иванова"
                        onChangeText={handleChange('lastName')}
                        onBlur={handleBlur('lastName')}
                        value={values.lastName}
                    />
                    {touched.lastName && errors.lastName && (
                        <Text style={styles.error}>{errors.lastName}</Text>
                    )}

                    <Text style={styles.label}>
                        {(initialValues.role === 'teacher' || initialValues.role === 'administrator') ? 'Имя' : 'Имя ребенка'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Алиса"
                        onChangeText={handleChange('firstName')}
                        onBlur={handleBlur('firstName')}
                        value={values.firstName}
                    />
                    {touched.firstName && errors.firstName && (
                        <Text style={styles.error}>{errors.firstName}</Text>
                    )}

                    <Text style={styles.label}>
                        {(initialValues.role === 'teacher' || initialValues.role === 'administrator')
                            ? 'Отчество (при наличии)'
                            : 'Отчество ребенка (при наличии)'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Андреевна"
                        onChangeText={handleChange('middleName')}
                        onBlur={handleBlur('middleName')}
                        value={values.middleName}
                    />
                    {touched.middleName && errors.middleName && (
                        <Text style={styles.error}>{errors.middleName}</Text>
                    )}

                    <Text style={styles.label}>
                        {(initialValues.role === 'teacher' || initialValues.role === 'administrator')
                            ? 'Номер телефона'
                            : 'Номер телефона родителя'}
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+7 (999) 959-49-69"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                        keyboardType="phone-pad"
                    />
                    {touched.phone && errors.phone && (
                        <Text style={styles.error}>{errors.phone}</Text>
                    )}

                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={[styles.input, { color: '#999' }]}
                        placeholder="ivanovaalice@gmail.com"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        editable={false}
                    />
                    {touched.email && errors.email && (
                        <Text style={styles.error}>{errors.email}</Text>
                    )}

                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: buttonColor }]}
                        onPress={() => handleSubmit()}
                        disabled={!dirty || isSubmitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </Formik>
    );
};

export default ProfileForm;

const styles = StyleSheet.create({
    formContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    label: {
        marginBottom: 6,
        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 16,
        color: '#000',
    },
    input: {
        height: 48,
        borderWidth: 0.7,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
    },
    submitButton: {
        height: 52,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 32,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
