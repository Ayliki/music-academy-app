import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Application {
    id: string;
    name: string;
    days?: string[];
    startTime?: string;
    endTime?: string;
    subject?: string;
    teacher?: string;
    confirmed?: boolean;
}

interface ApplicationCardProps {
    application: Application;
    onConfirm?: (application: Application) => void;
    onDelete?: (application: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onConfirm, onDelete }) => {
    return (
        <View style={styles.card}>
            {/* Top Right: Accept Button */}
            <View style={styles.topRightContainer}>
                {!application.confirmed && onConfirm && (
                    <TouchableOpacity style={styles.confirmButton} onPress={() => onConfirm(application)}>
                        <Text style={styles.actionText}>Принять</Text>
                        <Ionicons name="checkmark-circle" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <View style={styles.details}>
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{application.name}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Дни недели:</Text>
                        <Text style={styles.value}>
                            {(application.days || [])
                                .map(day => {
                                    const mapping: { [key: string]: string } = {
                                        'Понедельник': 'Пн',
                                        'Вторник': 'Вт',
                                        'Среда': 'Ср',
                                        'Четверг': 'Чт',
                                        'Пятница': 'Пт',
                                        'Суббота': 'Сб',
                                        'Воскресенье': 'Вс',
                                    };
                                    return mapping[day] || day;
                                })
                                .join(', ')}
                        </Text>

                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Время:</Text>
                        <Text style={styles.value}>{`с ${application.startTime} до ${application.endTime}`}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Предмет:</Text>
                        <Text style={styles.value}>{application.subject}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.label}>Педагог:</Text>
                        <Text style={styles.value}>{application.teacher}</Text>
                    </View>
                </View>
            </View>

            {/*Delete Button */}
            {onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(application)}>
                    <Ionicons name="trash-outline" size={24} color="black" />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ApplicationCard;

const styles = StyleSheet.create({
    card: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#CCC',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        position: 'relative',
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    actionText: {
        fontWeight: 600,
        fontSize: 16,
    },
    contentContainer: {
        marginTop: 10,
    },
    details: {
        flexDirection: 'column',
    },
    textContainer: {
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    value: {
        fontSize: 17,
        fontWeight: '600',
        marginTop: 4,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
});


