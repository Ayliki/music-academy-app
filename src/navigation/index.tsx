import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import {RootStackParamList} from './types';
import ProfileScreen from '../screens/ProfileScreen';
import MenuScreen from '../screens/MenuScreen';
import ApplicationScreen from '../screens/ApplicationScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import TeachersScreen from '../screens/teachers/TeachersScreen';
import EventsScreen from '../screens/EventsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="SignUp" component={SignUpScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}/>
            <Stack.Screen name="Menu" component={MenuScreen}/>
            <Stack.Screen name="Application" component={ApplicationScreen}/>
            <Stack.Screen name="Schedule" component={ScheduleScreen}/>
            <Stack.Screen name="Teachers" component={TeachersScreen}/>
            <Stack.Screen name="Events" component={EventsScreen}/>
        </Stack.Navigator>
    );
};

export default AppNavigator;
