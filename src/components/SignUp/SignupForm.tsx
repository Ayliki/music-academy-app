import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../navigation/types';
import SingleSelectDropdown from '../SingleSelectDropdown';
import { db } from '../../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { SelectableItem } from "../../types/SelectableItem";
import styles from "../../styles/SignUpStyles"
import SignupFormValues from "./SignUpFormValues";
import { SignUpSchema } from "./SignUpSchema";
import SubmitButton from "./SubmitButton";


interface SignupFormProps {
    initialValues: SignupFormValues;
    onSubmit: (values: SignupFormValues) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ initialValues, onSubmit }) => {
    const navigation = useNavigation<NavigationProps>();
    const [isTeacher, setIsTeacher] = useState(false);
    const [subjects, setSubjects] = useState<SelectableItem[]>([]);
    const [groups, setGroups] = useState<SelectableItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
                const groupsSnapshot = await getDocs(collection(db, 'groups'));

                const subjectsData = subjectsSnapshot.docs
                    .map(doc => ({ id: doc.id, name: doc.data().name }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                const groupsData = groupsSnapshot.docs
                    .map(doc => ({ id: doc.id, name: doc.data().name }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                setSubjects(subjectsData);
                setGroups(groupsData);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            {touched.firstName && errors.firstName &&
                                <Text style={styles.error}>{errors.firstName}</Text>}

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

                            <SingleSelectDropdown
                                label={isTeacher ? 'Выберите предмет' : 'Выберите группу'}
                                options={isTeacher ? subjects : groups}
                                selectedOption={(isTeacher ? values.subjectId : values.groupId) || ""}
                                onSelectionChange={(value) =>
                                    isTeacher ? setFieldValue('subjectId', value) : setFieldValue('groupId', value)
                                }
                                placeholder={loading ? 'Загрузка...' : isTeacher ? 'Выберите предмет' : 'Выберите группу'}
                            />

                            <SubmitButton onPress={handleSubmit as any} title="Отправить код" />

                            <TouchableOpacity style={styles.loginLinkContainer}
                                onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Уже есть аккаунт? <Text
                                    style={styles.loginText}>Войти</Text></Text>
                            </TouchableOpacity>

                            {!isTeacher && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsTeacher(true);
                                        setFieldValue('isTeacher', true);
                                    }}
                                >
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

export default SignupForm;