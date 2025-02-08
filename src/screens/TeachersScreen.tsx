// src/screens/TeachersScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TeachersList from 'src/components/TeacherList';
import { useTeachers } from '../hooks/useTeachers';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const navigation = useNavigation<NavigationProps>();

    const handleBack = () => {
        navigation.navigate('Menu');
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu title={'Преподаватели'} onBack={() => navigation.navigate('Menu')} />
            <TeachersList teachers={teachers} />
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
