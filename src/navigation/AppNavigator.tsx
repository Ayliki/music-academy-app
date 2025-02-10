import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from 'src/components/LoadingOverlay';
import TeacherMenuScreen from 'src/components/TeacherMenuScreen';
import LoginScreen from 'src/screens/LoginScreen';
import MenuScreen from 'src/screens/MenuScreen';
import { useAuth } from 'src/context/AuthContext';

const Stack = createStackNavigator();

const AuthStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const UserStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const TeacherStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="TeacherMenu" component={TeacherMenuScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
);

const AppNavigator: React.FC = () => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <LoadingScreen visible={false} />;
    }

    if (!user) {
        return <AuthStack />;
    }

    if (role === 'teacher') {
        return <TeacherStack />;
    } else {
        return <UserStack />;
    }
};

export default AppNavigator;
