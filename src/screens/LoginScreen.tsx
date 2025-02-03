// screens/LoginScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import CodeVerificationForm from '../components/CodeVerificationForm';
import { useAuth } from '../hooks/useAuth';

const LoginScreen: React.FC = () => {
    const {
        isLoading,
        isCodeStep,
        codeInput,
        setCodeInput,
        sendLoginCode,
        verifyCode,
        resetAuth,
    } = useAuth();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            {isCodeStep ? (
                <CodeVerificationForm
                    code={codeInput}
                    onChangeCode={setCodeInput}
                    onGoBack={resetAuth}
                    onVerify={verifyCode}
                />
            ) : (
                <LoginForm onSendCode={sendLoginCode} isLoading={isLoading} />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default LoginScreen;
