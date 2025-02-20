import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import TeachersList from '../../components/TeacherList';
import { useTeachers } from '../../hooks/useTeachers';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../navigation/types';
import HeaderMenu from '../../components/HeaderMenu';
import { useAuth } from '../../context/AuthContext';
import EditTeacherModal from '../../components/EditTeacherModal';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import CustomAlert from '../../components/CustomAlert';
import AddTeacherModal from '../../components/AddTeacherModal';

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const { role } = useAuth();
    const navigation = useNavigation<NavigationProps>();
    const [teacherToEdit, setTeacherToEdit] = useState<any>(null);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isAddTeacherModalVisible, setIsAddTeacherModalVisible] = useState(false);

    const onBack = () => {
        if (role === 'administrator') {
            navigation.navigate('AdminMenu');
        } else if (role === 'teacher') {
            navigation.navigate('TeacherMenu');
        } else {
            navigation.navigate('Menu');
        }
    };


    const handleEditTeacher = (teacher: any) => {
        setTeacherToEdit(teacher);
    };

    const handleAddSuccess = () => {
        setIsAddTeacherModalVisible(false);
        setTimeout(() => {
            setIsConfirmVisible(true);
        }, 300);
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
            <HeaderMenu title="Преподаватели" onBack={onBack} />
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
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsAddTeacherModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>Добавить педагога</Text>
                </TouchableOpacity>
            )}

            {role === 'administrator' && isAddTeacherModalVisible && (
                <AddTeacherModal
                    visible={isAddTeacherModalVisible}
                    onClose={handleAddSuccess}
                />
            )}

            {role === 'administrator' && (
                <CustomAlert onClose={() => setIsConfirmVisible(false)} visible={isConfirmVisible} role="administrator">
                    <Text style={styles.customAlertText}>Преподаватель успешно добавлен!</Text>
                </CustomAlert>
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
        backgroundColor: '#4DD3BA',
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
    customAlertText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

});
