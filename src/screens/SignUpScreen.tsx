import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { auth, db } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Yup Validation Schema
const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    ageGroup: Yup.string().required('Age Group is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignUpScreen = () => {
    const navigation = useNavigation<NavigationProps>();

    const handleSignUp = async (values: { name: string; email: string; ageGroup: string; password: string }) => {
        const { name, email, ageGroup, password } = values;

        try {
            // Check if the email is already registered
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                alert('This email is already registered. Please log in.');
                return;
            }

            // Proceed with sign-up if email is not in use
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user info in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                ageGroup,
                role: 'student',
                createdAt: new Date(),
            });

            console.log('User registered and saved in Firestore:', user.uid);
            navigation.navigate('Home');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                alert('This email is already in use. Please try logging in.');
            } else {
                alert('Error during sign-up: ' + error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <Formik
                initialValues={{ name: '', email: '', ageGroup: '', password: '' }}
                validationSchema={SignUpSchema}
                onSubmit={handleSignUp}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            value={values.name}
                        />
                        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

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
                            placeholder="Age Group"
                            onChangeText={handleChange('ageGroup')}
                            onBlur={handleBlur('ageGroup')}
                            value={values.ageGroup}
                        />
                        {touched.ageGroup && errors.ageGroup && <Text style={styles.error}>{errors.ageGroup}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry
                        />
                        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                        <Button title="Sign Up" onPress={handleSubmit as any} />
                        <Button
                            title="Back to Login"
                            onPress={() => navigation.goBack()}
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

export default SignUpScreen;
