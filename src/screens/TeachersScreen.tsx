import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TeachersList from 'src/components/TeacherList';
import { useTeachers } from '../hooks/useTeachers';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';
import { useAuth } from 'src/context/AuthContext';

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const { role } = useAuth();
    const navigation = useNavigation<NavigationProps>();
    const [isAddTeacherModalVisible, setIsAddTeacherModalVisible] = useState(false);

    const handleEditTeacher = (teacher: any) => {
        // Implement teacher edit logic here (e.g., open an edit modal)
    };

    const handleDeleteTeacher = async (teacher: any) => {
        // Implement teacher deletion logic here (e.g., call Firestore delete)
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu title={'Преподаватели'} onBack={() => navigation.navigate('Menu')} />
            <TeachersList
                teachers={teachers}
                isAdmin={role === 'administrator'}
                onEditTeacher={handleEditTeacher}
                onDeleteTeacher={handleDeleteTeacher}
            />
        </SafeAreaView>
    );
};

export default TeachersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Outfit',
    },
});
