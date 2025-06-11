import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '../components/Header';
import SignupForm from '../components/SignUp/SignupForm';
import SignUpFormValues from '../components/SignUp/SignUpFormValues';
import SignupVerificationForm from '../components/SignupVerficiationForm';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from 'src/context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
    const [isCodeStep, setIsCodeStep] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [signupData, setSignupData] = useState<SignUpFormValues>({
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        email: '',
        groupId: '',
        subjectId: '',
        isTeacher: false,
    });

    const navigation = useNavigation<NavigationProp>();

    const { role, setCodeVerified } = useAuth();

    // Step 1: Handle Sign-Up Process
    const handleSignUp = async (values: SignUpFormValues) => {
        try {
            const emailLowerCase = values.email.toLowerCase();

            // Check if email already exists in users collection
            const userDocRef = doc(db, 'users', emailLowerCase);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                // Email already exists, show alert
                Alert.alert(
                    "Ошибка регистрации",
                    "Этот email уже зарегистрирован в системе",
                    [{ text: "OK" }]
                );
                return;
            }

            setSignupData(values);
            setIsCodeStep(true);
            setTempEmail(emailLowerCase);

            await setDoc(doc(db, 'users', emailLowerCase), {
                lastName: values.lastName,
                firstName: values.firstName,
                middleName: values.middleName,
                phone: values.phone,
                email: emailLowerCase,
                groupId: values.groupId,
                subjectId: values.subjectId,
                confirmed: false,
                codeVerified: false,
                role: values.isTeacher ? 'teacher' : 'default',
            });

            try {
                const response = await fetch('https://sendemailcode-xjqcjc5s3a-uc.a.run.app', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: values.email }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error sending code:', errorData.error);
                }
            } catch (error: any) {
                console.error('Error sending code:', error.message);
            }

        } catch (error: any) {
            console.error('SignUp Error:', error);
        }
    };

    // Step 2: Handle Code Verification
    const handleVerifyCode = async () => {
        try {
            const response = await fetch('https://verifyemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: tempEmail, code: codeInput }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Verification error:', errorData.error);
                return;
            }

            await updateDoc(doc(db, 'users', tempEmail.toLowerCase()), {
                codeVerified: true,
            });

            let authSuccess = false;
            try {
                // Try to create a new user
                await createUserWithEmailAndPassword(
                    auth,
                    tempEmail,
                    'someplaceholderpassword'
                );
                authSuccess = true;
            } catch (authError: any) {
                // If email already exists, sign in instead
                if (authError.code === 'auth/email-already-in-use') {
                    console.log('Email already exists, signing in instead');
                    try {
                        await signInWithEmailAndPassword(
                            auth,
                            tempEmail,
                            'someplaceholderpassword'
                        );
                        authSuccess = true;
                    } catch (signInError: any) {
                        console.error('Error signing in:', signInError.message);
                        return; // Exit the function if sign-in fails
                    }
                } else {
                    // Rethrow other errors
                    throw authError;
                }
            }

            // Only proceed with updating the code verification status if authentication was successful
            if (authSuccess) {
                // Update the codeVerified state in the AuthContext
                // This will trigger the AppNavigator to render the appropriate stack
                setCodeVerified(true);
            }
        } catch (error: any) {
            // Don't log the error if it's already been handled
            if (error.code !== 'auth/email-already-in-use') {
                console.error('Verification error:', error.message);
            }
        } finally {
        }
    };

    const handleGoBack = () => {
        setIsCodeStep(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="never">
                <Header />

                {isCodeStep ? (
                    <SignupVerificationForm
                        code={codeInput}
                        onChangeCode={setCodeInput}
                        onGoBack={handleGoBack}
                        onVerify={handleVerifyCode}
                    />
                ) : (
                    <SignupForm initialValues={signupData} onSubmit={handleSignUp} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
});

export default SignUpScreen;
