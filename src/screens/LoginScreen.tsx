import React from 'react';
import { SafeAreaView, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';
import CodeVerificationForm from '../components/CodeVerificationForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

const LoginScreen: React.FC = () => {
    const {
        isLoading,
        isCodeStep,
        codeInput,
        setCodeInput,
        sendLoginCode,
        login,
        resetAuth,
    } = useAuth();

    const navigation = useNavigation<NavigationProps>();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.safeArea}>
                <Header />
                {isCodeStep ? (
                    <CodeVerificationForm
                        code={codeInput}
                        onChangeCode={setCodeInput}
                        onGoBack={resetAuth}
                        onVerify={() => login(() => { })}
                    />
                ) : (
                    <LoginForm onSendCode={sendLoginCode} isLoading={isLoading} />
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default LoginScreen;
