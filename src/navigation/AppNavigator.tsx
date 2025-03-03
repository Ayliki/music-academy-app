import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoadingScreen from 'src/components/LoadingOverlay';
import LoginScreen from 'src/screens/LoginScreen';
import MenuScreen from 'src/screens/MenuScreen';
import {useAuth} from 'src/context/AuthContext';
import TeacherStack from './TeacherStack';
import AdminStack from './AdminStack';
import UnconfirmedScreen from 'src/screens/UnconfirmedScreen';
import SignUpScreen from 'src/screens/SignUpScreen';
import DefaultStack from './DefaultStack';
import {NavigationProps} from './types';
import {useNavigation} from '@react-navigation/native';
import RegistrationStack from './RegistrationStack';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Menu" component={MenuScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
);


const AppNavigator: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const {firebaseUser, role, loading, confirmed, codeVerified} = useAuth();

    if (loading) {
        return <LoadingScreen visible={false}/>;
    }

    if (!firebaseUser) {
        return <AuthStack/>;
    }

    if (!codeVerified) {
        return <RegistrationStack/>;
    }

    if (firebaseUser && !confirmed) {
        return <UnconfirmedScreen/>;
    }

    if (role === 'administrator') {
        return <AdminStack/>;
    } else if (role === 'teacher') {
        return <TeacherStack/>;
    } else {
        return <DefaultStack/>;
    }
};

export default AppNavigator;
