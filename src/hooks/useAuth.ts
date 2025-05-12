import { useState } from 'react';
import { Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { updateDoc } from 'firebase/firestore';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCodeStep, setIsCodeStep] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [codeInput, setCodeInput] = useState('');

    const sendLoginCode = async (email: string) => {
        try {
            setIsLoading(true);
            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', email?.toLowerCase() || '');
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists) {
                Alert.alert('Ошибка', 'Такой пользователь не зарегистрирован');
                setIsLoading(false);
                return;
            }
            // Send code via API
            const response = await fetch('https://sendemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Ошибка', errorData.error || 'Не удалось отправить код');
                setIsLoading(false);
                return;
            }
            setTempEmail(email);
            setIsCodeStep(true);
        } catch (error: any) {
            Alert.alert('Ошибка', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = async (): Promise<boolean> => {
        try {
            const response = await fetch('https://verifyemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: tempEmail, code: codeInput }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Code verified successfully', data);
                return true;
            } else {
                const errorData = await response.json();
                console.error('Verification error:', errorData.error);
                Alert.alert('Ошибка', errorData.error || 'Ошибка верификации');
                return false;
            }
        } catch (error: any) {
            console.error('Verification error:', error.message);
            Alert.alert('Ошибка', error.message);
            return false;
        }
    };

    const login = async (onSuccess: () => void): Promise<void> => {
        const verified = await verifyCode();
        if (verified) {
            try {
                await updateDoc(doc(db, 'users', tempEmail.toLowerCase()), {
                    codeVerified: true,
                });

                await signInWithEmailAndPassword(auth, tempEmail, 'someplaceholderpassword');
                onSuccess();
            } catch (error: any) {
                console.error('Error signing in:', error.message);
                Alert.alert('Ошибка', error.message);
            }
        }
    };

    const resetAuth = () => {
        setIsCodeStep(false);
        setTempEmail('');
        setCodeInput('');
    };

    return {
        isLoading,
        isCodeStep,
        tempEmail,
        codeInput,
        setCodeInput,
        sendLoginCode,
        verifyCode,
        login,
        resetAuth,
    };
};
