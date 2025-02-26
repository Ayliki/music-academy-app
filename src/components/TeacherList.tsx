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
};

const TeachersList: React.FC<TeachersListProps> = ({ teachers}) => {
    return (
        <ScrollView contentContainerStyle={styles.teacherList}>
            {teachers.map((teacher) => (
                <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
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
