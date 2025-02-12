import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    photo?: string;
    confirmed?: boolean;
    email?: string;
    role?: string;
    subject?: string;
    group?: string;
    selection?: string;
}

interface UserCardProps {
    user: User;
    onConfirm?: (user: User) => void;
    onDelete?: (user: User) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onConfirm, onDelete }) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    const isTeacher = user.role === 'teacher';

    return (
        <View style={styles.card}>
            <View style={styles.topRightContainer}>
                {!user.confirmed && onConfirm && (
                    <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(user)}>
                        <Text style={styles.actionText}>Принять</Text>
                        <Ionicons name="checkmark-circle" size={24} color="black" />
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
                        <Text style={styles.label}>
                            {isTeacher ? 'Предмет:' : 'Группа:'}
                        </Text>
                        <Text style={styles.subjectOrGroup}>
                            {isTeacher ? (user.subject || user.selection || 'N/A') : user.group || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Роль:</Text>
                        <Text style={styles.roleText}>{isTeacher ? 'Учитель' : 'Студент'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomRightContainer}>
                {onDelete && (
                    <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(user)}>
                        <Ionicons name="trash-outline" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default UserCard;

const styles = StyleSheet.create({
    card: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#F4F4F4',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    contentContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    details: {
        flex: 1,
    },
    textContainer: {
        flexDirection: 'column',
        marginBottom: 4,
    },
    label: {
        fontWeight: '400',
        fontSize: 16,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    phone: {
        fontSize: 18,
        fontWeight: '600',
    },
    email: {
        fontSize: 18,
        fontWeight: '600',
    },
    subjectOrGroup: {
        fontSize: 18,
        fontWeight: '600',
    },
    roleText: {
        fontSize: 18,
        fontWeight: '600',
    },
    topRightContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    confirmButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomRightContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 16,
        fontWeight: 600,
        marginRight: 6,
    }
});