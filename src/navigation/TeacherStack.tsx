import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherMenuScreen from '../screens/teachers/TeacherMenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EventsScreen from '../screens/EventsScreen';
import ScheduleScreen from 'src/screens/ScheduleScreen';

const Stack = createNativeStackNavigator();

const TeacherStack = () => (
    <Stack.Navigator initialRouteName="TeacherMenu">
        <Stack.Screen
            name="TeacherMenu"
            component={TeacherMenuScreen}
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
            name="TeacherSchedule"
            component={ScheduleScreen}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
);

export default TeacherStack;
