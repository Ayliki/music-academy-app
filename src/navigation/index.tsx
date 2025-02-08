import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import { RootStackParamList } from './types';
import ProfileScreen from '../screens/ProfileScreen';
import MenuScreen from '../screens/MenuScreen';
import ApplicationScreen from '../screens/ApplicationScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TeachersScreen from 'src/screens/TeachersScreen';
import EventsScreen from 'src/screens/EventsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name='Profile' component={ProfileScreen} />
                <Stack.Screen name='Menu' component={MenuScreen} />
                <Stack.Screen name='Application' component={ApplicationScreen} />
                <Stack.Screen name='Schedule' component={ScheduleScreen} />
                <Stack.Screen name='Teachers' component={TeachersScreen} />
                <Stack.Screen name='Events' component={EventsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
