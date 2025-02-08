import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const teacherImages: { [key: string]: any } = {
    'teacher1.jpg': require('../../assets/images/teachers/teacher1.png'),
    'teacher2.jpg': require('../../assets/images/teachers/teacher2.png'),
    'teacher3.jpg': require('../../assets/images/teachers/teacher3.png'),
    'teacher4.jpg': require('../../assets/images/teachers/teacher4.png'),
    'teacher5.jpg': require('../../assets/images/teachers/teacher5.png'),
};

type Teacher = {
    id: string;
    name: string;
    subject: string;
    photo: string;
};

type TeacherCardProps = {
    teacher: Teacher;
};

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={teacherImages[teacher.photo]}
                    style={styles.profileImage}
                />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.teacherInfo}>
                    <Text style={styles.label}>Имя: </Text>
                    <Text style={styles.teacherName}>{teacher.name}</Text>
                </View>
                <View style={styles.teacherInfo}>
                    <Text style={styles.label}>Предмет: </Text>
                    <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                </View>
            </View>
        </View>
    );
};

export default TeacherCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 3,
        borderColor: '#EEEEEE',
        borderRadius: 15,
        maxWidth: 369,
        maxHeight: 250,
    },
    imageContainer: {
        width: 150,
        height: 189,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 150,
        height: 189,
        resizeMode: 'contain',
        borderRadius: 15,
        transform: [{ scale: 0.8 }],
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'flex-start',
        marginTop: 8
    },
    teacherInfo: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    label: {
        fontWeight: '400',
        fontSize: 18,
        marginRight: 4,
    },
    teacherName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    teacherSubject: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
});  