import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import TeacherCard from './TeacherCard';

type Teacher = {
    id: string;
    name: string;
    subject: string;
    photo: string;
};

type TeachersListProps = {
    teachers: Teacher[];
    isAdmin?: boolean;
    onEditTeacher?: (teacher: Teacher) => void;
    onDeleteTeacher?: (teacher: Teacher) => void;
};

const TeachersList: React.FC<TeachersListProps> = ({ teachers, isAdmin, onEditTeacher, onDeleteTeacher }) => {
    return (
        <ScrollView contentContainerStyle={styles.teacherList}>
            {teachers.map((teacher) => (
                <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    isAdmin={isAdmin}
                    onEdit={onEditTeacher}
                    onDelete={onDeleteTeacher}
                />
            ))}
        </ScrollView>
    );
};

export default TeachersList;

const styles = StyleSheet.create({
    teacherList: {
        padding: 16,
    },
});
