import { useState } from 'react';
import { Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isCodeStep, setIsCodeStep] = useState(false);
    const [tempEmail, setTempEmail] = useState('');
    const [codeInput, setCodeInput] = useState('');

    const sendLoginCode = async (email: string) => {
        try {
            setIsLoading(true);
            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', email.toLowerCase());
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

    const verifyCode = async () => {
        try {
            const response = await fetch('https://verifyemailcode-xjqcjc5s3a-uc.a.run.app', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: tempEmail, code: codeInput }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Code verified successfully', data);
            } else {
                const errorData = await response.json();
                console.error('Verification error:', errorData.error);
            }
        } catch (error: any) {
            console.error('Verification error:', error.message);
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
        resetAuth,
    };
};
