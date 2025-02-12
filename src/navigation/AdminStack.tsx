import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminMenuScreen from 'src/screens/AdminMenuScreen';
import ProfileScreen from 'src/screens/ProfileScreen';
import EventsScreen from 'src/screens/EventsScreen';
import ScheduleScreen from 'src/screens/ScheduleScreen';
import TeachersScreen from 'src/screens/TeachersScreen';
import UsersScreen from 'src/screens/UserScreen';

export type AdminStackParamList = {
    AdminMenu: undefined;
    Profile: undefined;
    Events: undefined;
    Schedule: undefined;
    Applications: undefined;
    Teachers: undefined;
    Users: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

const AdminStack: React.FC = () => (
    <Stack.Navigator initialRouteName="AdminMenu">
        <Stack.Screen
            name="AdminMenu"
            component={AdminMenuScreen}
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
        {/* <Stack.Screen
      name="Applications"
      component={ApplicationsScreen}
      options={{ headerShown: false }}
    /> */}
        <Stack.Screen
            name="Teachers"
            component={TeachersScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
);

export default AdminStack;
