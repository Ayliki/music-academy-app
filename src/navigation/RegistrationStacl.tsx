import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from 'src/screens/SignUpScreen';
import LoginScreen from 'src/screens/LoginScreen';

export type RegistrationStackParamList = {
    SignUp: undefined;
    Login: undefined;
};

const Stack = createStackNavigator<RegistrationStackParamList>();

const RegistrationStack: React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default RegistrationStack;
