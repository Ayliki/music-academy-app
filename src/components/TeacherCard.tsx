import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Teacher = {
    id: string;
    name: string;
    subject: string;
    photo: string;
};

type TeacherCardProps = {
    teacher: Teacher;
    isAdmin?: boolean;
    onEdit?: (teacher: Teacher) => void;
    onDelete?: (teacher: Teacher) => void;
};

const teacherImages: { [key: string]: any } = {
    'teacher1.jpg': require('../../assets/images/teachers/teacher1.png'),
    'teacher2.jpg': require('../../assets/images/teachers/teacher2.png'),
    'teacher3.jpg': require('../../assets/images/teachers/teacher3.png'),
    'teacher4.jpg': require('../../assets/images/teachers/teacher4.png'),
    'teacher5.jpg': require('../../assets/images/teachers/teacher5.png'),
};

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, isAdmin = false, onEdit, onDelete }) => {
    const displayName = teacher.name ? teacher.name.trim() : '';
    const imageSource = teacherImages[teacher.photo] || { uri: teacher.photo };
    console.log(teacher.name)

    return (
        <View style={styles.card}>
            {isAdmin && (
                <TouchableOpacity style={styles.editIcon} onPress={() => onEdit && onEdit(teacher)}>
                    <Ionicons name="create" size={20} color="#666666" />
                </TouchableOpacity>
            )}

            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.profileImage} />
            </View>
            <View style={styles.cardContent}>
                <View style={styles.teacherInfo}>
                    <Text style={styles.label}>Имя: </Text>
                    <Text style={styles.teacherName}>{displayName}</Text>
                </View>
                <View style={styles.teacherInfo}>
                    <Text style={styles.label}>Предмет: </Text>
                    <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                </View>
            </View>

            {isAdmin && (
                <TouchableOpacity style={styles.deleteIcon} onPress={() => onDelete && onDelete(teacher)}>
                    <Ionicons name="trash" size={20} color="#666666" />
                </TouchableOpacity>
            )}
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
        position: 'relative',
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
    editIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'transparent',
        padding: 6,
        borderRadius: 6,
        zIndex: 2,
    },
    deleteIcon: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'transparent',
        padding: 6,
        borderRadius: 6,
        zIndex: 2,
    },
});  