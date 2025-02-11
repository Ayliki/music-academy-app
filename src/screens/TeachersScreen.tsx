import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import TeachersList from 'src/components/TeacherList';
import { useTeachers } from '../hooks/useTeachers';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';
import { useAuth } from 'src/context/AuthContext';
import EditTeacherModal from 'src/components/EditTeacherModal';

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const { role } = useAuth();
    const navigation = useNavigation<NavigationProps>();
    const [teacherToEdit, setTeacherToEdit] = useState<any>(null);
    const [isAddTeacherModalVisible, setIsAddTeacherModalVisible] = useState(false);

    const handleEditTeacher = (teacher: any) => {
        setTeacherToEdit(teacher);
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
            {role === 'administrator' && (
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddTeacherModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Добавить преподавателя</Text>
                </TouchableOpacity>
            )}
            {teacherToEdit && (
                <EditTeacherModal
                    visible={true}
                    onClose={() => setTeacherToEdit(null)}
                    teacher={teacherToEdit}
                />
            )}
            {/* {role === 'administrator' && (
                <AddTeacherModal
                    visible={isAddTeacherModalVisible}
                    onClose={() => setIsAddTeacherModalVisible(false)}
                />
            )} */}
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
    addButton: {
        backgroundColor: '#00A9E3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
        marginVertical: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },

});
