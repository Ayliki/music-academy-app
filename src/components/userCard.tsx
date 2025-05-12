import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {getFirestore, doc, getDoc} from 'firebase/firestore';
import styles from "../styles/UserCardStyles";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    photo?: string;
    confirmed?: boolean;
    email?: string;
    role?: string;
    subjectId?: string;
    groupId?: string;
}

interface UserCardProps {
    user: User;
    onConfirm?: (user: User) => void;
    onDelete?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({user, onConfirm, onDelete}) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const isTeacher = user.role === 'teacher';
    const [subjectOrGroupName, setSubjectOrGroupName] = useState<string>('N/A');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = getFirestore();
                if (isTeacher) {
                    // Сначала пробуем получить предмет по subjectId
                    if (user.subjectId) {
                        const subjectRef = doc(db, 'subjects', user.subjectId);
                        const subjectSnap = await getDoc(subjectRef);
                        if (subjectSnap.exists()) {
                            setSubjectOrGroupName(subjectSnap.data().name);
                            return;
                        }
                    }
                    // Если subjectId не найден или документ отсутствует, пробуем groupId
                    if (user.groupId) {
                        const groupRef = doc(db, 'groups', user.groupId);
                        const groupSnap = await getDoc(groupRef);
                        if (groupSnap.exists()) {
                            setSubjectOrGroupName(groupSnap.data().name);
                            return;
                        }
                    }
                } else {
                    // Для студента всегда получаем группу
                    if (user.groupId) {
                        const groupRef = doc(db, 'groups', user.groupId);
                        const groupSnap = await getDoc(groupRef);
                        if (groupSnap.exists()) {
                            setSubjectOrGroupName(groupSnap.data().name);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Ошибка при получении данных: ', error);
            }
        };

        fetchData();
    }, [user, isTeacher]);

    return (
        <View style={styles.card}>
            <View style={styles.topRightContainer}>
                {!user.confirmed && onConfirm && (
                    <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(user)}>
                        <Text style={styles.actionText}>Принять</Text>
                        <Ionicons name="checkmark-circle" size={24} color="black"/>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.contentContainer}>
                <View style={styles.details}>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>ФИО:</Text>
                        <Text style={styles.name}>{fullName}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Номер телефона:</Text>
                        <Text style={styles.phone}>{user.phone || 'N/A'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Почта:</Text>
                        <Text style={styles.email}>{user.email || 'N/A'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Роль:</Text>
                        <Text style={styles.roleText}>{isTeacher ? 'Учитель' : 'Студент'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>
                            {isTeacher ? 'Предмет:' : 'Группа:'}
                        </Text>
                        <Text style={styles.subjectOrGroup}>{subjectOrGroupName}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomRightContainer}>
                {onDelete && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(user)}>
                        <Ionicons name="trash-outline" size={24} color="black"/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default UserCard;
