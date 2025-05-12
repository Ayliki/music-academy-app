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

const Stack = createNativeStackNavigator<DefaultStackParamList>();

const DefaultStack: React.FC = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Application" component={ApplicationScreen} />
        <Stack.Screen name="Teachers" component={TeachersScreen} />
    </Stack.Navigator>
);

export default DefaultStack;
