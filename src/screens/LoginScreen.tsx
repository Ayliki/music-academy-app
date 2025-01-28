import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { db } from '../services/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    code: Yup.string().length(6, 'Code must be 6 characters long').required('Confirmation code is required'),
});

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProps>();

    const handleLogin = async (values: { email: string; code: string }) => {
        const { email, code } = values;
        try {
            const userRef = doc(db, 'users', email);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                throw new Error('User not found');
            }

            const userData = userDoc.data();

            if (userData?.code !== code) {
                throw new Error('Invalid confirmation code');
            }

            console.log('Login successful!');
            navigation.navigate('Home');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error during login:', error.message);
                alert(error.message);
            } else {
                console.error('Unknown error occurred:', error);
                alert('An unknown error occurred. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Formik
                initialValues={{ email: '', code: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />
                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Confirmation Code"
                            onChangeText={handleChange('code')}
                            onBlur={handleBlur('code')}
                            value={values.code}
                            secureTextEntry
                        />
                        {touched.code && errors.code && <Text style={styles.error}>{errors.code}</Text>}

                        <Button title="Login" onPress={handleSubmit as any} />
                        <Button
                            title="Go to Sign Up"
                            onPress={() => navigation.navigate('SignUp')}
                        />
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16, borderRadius: 8 },
    error: { color: 'red', fontSize: 12, marginBottom: 8 },
});

export default LoginScreen;
