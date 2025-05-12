import React from 'react';
import LoadingScreen from 'src/components/LoadingOverlay';
import { useAuth } from 'src/context/AuthContext';
import TeacherStack from './TeacherStack';
import AdminStack from './AdminStack';
import UnconfirmedScreen from 'src/screens/UnconfirmedScreen';
import DefaultStack from './DefaultStack';
import RegistrationStack from './RegistrationStack';
import AuthStack from './AuthStack';


const AppNavigator: React.FC = () => {
    const { firebaseUser, role, loading, confirmed, codeVerified } = useAuth();

    if (loading) {
        return <LoadingScreen visible={false} />;
    }

    if (!firebaseUser) {
        return <AuthStack />;
    }

    if (!codeVerified) {
        return <RegistrationStack />;
    }

    if (firebaseUser && !confirmed) {
        return <UnconfirmedScreen />;
    }

    if (role === 'administrator') {
        return <AdminStack />;
    }

    if (role === 'teacher') {
        return <TeacherStack />;
    }
    return <DefaultStack />;
};

export default AppNavigator;
