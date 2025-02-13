import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Header from '../components/Header';
import SignupForm, {SignupFormValues} from '../components/SignupForm';
import SignupVerificationForm from '../components/SignupVerficiationForm';
import {auth} from '../services/firebaseConfig';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {doc, setDoc} from 'firebase/firestore';
import {db} from '../services/firebaseConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
    const [isCodeStep, setIsCodeStep] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [signupData, setSignupData] = useState<SignupFormValues>({
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        email: '',
        selection: '',
    });

    const navigation = useNavigation<NavigationProp>();

    // Step 1: Handle Sign-Up Process
    const handleSignUp = async (values: SignupFormValues) => {
        try {
            setSignupData(values);

            await createUserWithEmailAndPassword(auth, values.email, 'someplaceholderpassword');
            setTempEmail(values.email);

            await setDoc(doc(db, 'users', values.email.toLowerCase()), {
                lastName: values.lastName,
                firstName: values.firstName,
                middleName: values.middleName,
                phone: values.phone,
                email: values.email,
                selection: values.selection,
            });

            // Request a verification code from the backend
            const response = await fetch('https://sendemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: values.email}),
            });
            if (response.ok) {
                setIsCodeStep(true);
            } else {
                const errorData = await response.json();
                console.error('Error sending code:', errorData.error);
            }
        } catch (error: any) {
            console.error('SignUp Error:', error.message);
        }
    };

    // Step 2: Handle Code Verification
    const handleVerifyCode = async () => {
        try {
            const response = await fetch('https://verifyemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: tempEmail, code: codeInput}),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Code verified successfully', data);
                navigation.navigate('Menu');
            } else {
                const errorData = await response.json();
                console.error('Verification error:', errorData.error);
            }
        } catch (error: any) {
            console.error('Verification error:', error.message);
        }
    };

    const handleGoBack = () => {
        setIsCodeStep(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <Header/>

                    {isCodeStep ? (
                        <SignupVerificationForm
                            code={codeInput}
                            onChangeCode={setCodeInput}
                            onGoBack={handleGoBack}
                            onVerify={handleVerifyCode}
                        />
                    ) : (
                        <SignupForm initialValues={signupData} onSubmit={handleSignUp}/>
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
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
