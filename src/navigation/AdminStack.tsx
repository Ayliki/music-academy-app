import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminMenuScreen from '../screens/admins/AdminMenuScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import EventsScreen from 'src/screens/EventsScreen';
import ScheduleScreen from 'src/screens/ScheduleScreen';
import TeachersScreen from '../screens/teachers/TeachersScreen';
import UsersScreen from 'src/screens/UserScreen';
import AdminApplicationsScreen from '../screens/admins/AdminAplicationScreen';

export type AdminStackParamList = {
    AdminMenu: undefined;
    Profile: undefined;
    Events: undefined;
    Schedule: undefined;
    Applications: undefined;
    Teachers: undefined;
    Users: undefined;
    Lessons: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack: React.FC = () => (
    <Stack.Navigator initialRouteName="AdminMenu">
        <Stack.Screen
            name="AdminMenu"
            component={AdminMenuScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Events"
            component={EventsScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Applications"
            component={AdminApplicationsScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Teachers"
            component={TeachersScreen}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{headerShown: false}}
        />

    </Stack.Navigator>
);

export default AdminStack;
