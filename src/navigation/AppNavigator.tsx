import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from 'src/components/LoadingOverlay';
import LoginScreen from 'src/screens/LoginScreen';
import MenuScreen from 'src/screens/MenuScreen';
import { useAuth } from 'src/context/AuthContext';
import TeacherStack from './TeacherStack';
import AdminStack from './AdminStack';
import UnconfirmedScreen from 'src/screens/UnconfirmedScreen';
import SignUpScreen from 'src/screens/SignUpScreen';
import DefaultStack from './DefaultStack';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const UserStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);


const AppNavigator: React.FC = () => {
    const { user, role, loading, confirmed } = useAuth();

    if (loading) {
        return <LoadingScreen visible={false} />;
    }

    if (!user) {
        return <AuthStack />;
    }

    if (!confirmed) {
        return <UnconfirmedScreen />;
    }

    if (role === 'administrator') {
        return <AdminStack />;
    } else if (role === 'teacher') {
        return <TeacherStack />;
    } else {
        return <DefaultStack />;
    }
};

export default AppNavigator;
