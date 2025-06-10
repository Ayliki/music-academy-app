import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminMenuScreen from '../screens/admins/AdminMenuScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import EventsScreen from 'src/screens/EventsScreen';
import ScheduleScreen from 'src/screens/ScheduleScreen';
import TeachersScreen from '../screens/teachers/TeachersScreen';
import UsersScreen from '../screens/admins/UserScreen';
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
    <Stack.Navigator initialRouteName="AdminMenu" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AdminMenu" component={AdminMenuScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Events" component={EventsScreen} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Applications" component={AdminApplicationsScreen} />
        <Stack.Screen name="Teachers" component={TeachersScreen} />
        <Stack.Screen name="Users" component={UsersScreen} />
    </Stack.Navigator>
);

export default AdminStack;
