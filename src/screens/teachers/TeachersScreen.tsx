import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import TeachersList from '../../components/TeacherList';
import {useTeachers} from '../../hooks/useTeachers';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../navigation/types';
import HeaderMenu from '../../components/HeaderMenu';
import {useAuth} from '../../context/AuthContext';

const TeachersScreen: React.FC = () => {
    const {teachers} = useTeachers();
    const {role} = useAuth();
    const navigation = useNavigation<NavigationProps>();

    const onBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu title="Преподаватели" onBack={onBack}/>
            <TeachersList teachers={teachers}/>
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
