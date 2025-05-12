import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import SignupForm from '../components/SignUp/SignupForm';
import SignUpFormValues from '../components/SignUp/SignUpFormValues';
import SignupVerificationForm from '../components/SignupVerficiationForm';
import { auth } from '../services/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
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

    const { role } = useAuth();

    // Step 1: Handle Sign-Up Process
    const handleSignUp = async (values: SignUpFormValues) => {
        try {
            setSignupData(values);
            setIsCodeStep(true);
            setTempEmail(values.email.toLowerCase());

            await setDoc(doc(db, 'users', values.email.toLowerCase()), {
                lastName: values.lastName,
                firstName: values.firstName,
                middleName: values.middleName,
                phone: values.phone,
                email: values.email.toLowerCase(),
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

            await createUserWithEmailAndPassword(
                auth,
                tempEmail,
                'someplaceholderpassword'
            );

            const rootRoute = role === 'administrator'
                ? 'AdminMenu'
                : 'Menu';

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: rootRoute }],
                })
            );
        } catch (error: any) {
            console.error('Verification error:', error.message);
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
