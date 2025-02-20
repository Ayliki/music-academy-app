import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from 'src/screens/MenuScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import EventsScreen from 'src/screens/EventsScreen';
import ScheduleScreen from 'src/screens/ScheduleScreen';
import ApplicationScreen from 'src/screens/ApplicationScreen';
import TeachersScreen from '../screens/teachers/TeachersScreen';

export type DefaultStackParamList = {
    Menu: undefined;
    Profile: undefined;
    Events: undefined;
    Schedule: undefined;
    Application: undefined;
    Teachers: undefined;
};

const Stack = createNativeStackNavigator();

const DefaultStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Menu"
                component={MenuScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Events"
                component={EventsScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Schedule"
                component={ScheduleScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Application"
                component={ApplicationScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Teachers"
                component={TeachersScreen}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default DefaultStack;
