import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import TeachersList from 'src/components/TeacherList';
import { useTeachers } from '../hooks/useTeachers';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';
import { useAuth } from 'src/context/AuthContext';
import EditTeacherModal from 'src/components/EditTeacherModal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/services/firebaseConfig';
import CustomAlert from 'src/components/CustomAlert';

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const { role } = useAuth();
    const navigation = useNavigation<NavigationProps>();
    const [teacherToEdit, setTeacherToEdit] = useState<any>(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const handleEditTeacher = (teacher: any) => {
        setTeacherToEdit(teacher);
    };

    const handleEditSuccess = () => {
        setTeacherToEdit(null);
        setTimeout(() => {
            setIsConfirmVisible(true);
        }, 300);
    };

    const handleDeleteTeacher = async (teacher: any) => {
        try {
            Alert.alert(
                'Подтверждение удаления',
                'Вы уверены, что хотите удалить преподавателя?',
                [
                    { text: 'Отмена', style: 'cancel' },
                    {
                        text: 'Удалить',
                        style: 'destructive',
                        onPress: async () => {
                            await deleteDoc(doc(db, 'users', teacher.id));
                            Alert.alert('Успех', 'Преподаватель удален');
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Ошибка при удалении преподавателя:', error);
            Alert.alert('Ошибка', error.message);
        }
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
            {teacherToEdit && (
                <EditTeacherModal
                    visible={true}
                    onClose={() => setTeacherToEdit(null)}
                    teacher={teacherToEdit}
                    onConfirm={handleEditSuccess}
                />
            )}
            {role === 'administrator' && (
                <CustomAlert
                    visible={isConfirmVisible}
                    onClose={() => setIsConfirmVisible(false)}
                    role="administrator"
                />
            )}
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
        backgroundColor: '#4DD3BA;',
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
