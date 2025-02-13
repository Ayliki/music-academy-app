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

            <View style={styles.leftContainer}>

                {!application.confirmed && onConfirm && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onConfirm(application)}
                    >
                        <Ionicons name="checkmark-circle" size={24} color="black" />
                        <Text style={styles.buttonText}>Принять</Text>
                    </TouchableOpacity>
                )}
                {onDelete && (
                    <TouchableOpacity
                        style={[styles.actionButton, { marginTop: 8 }]}
                        onPress={() => onDelete(application)}
                    >
                        <Ionicons name="trash-outline" size={24} color="black" />
                        <Text style={styles.buttonText}>Удалить</Text>
                    </TouchableOpacity>
                )}
            </View>


            <View style={styles.infoContainer}>
                <Text style={styles.name}>{application.name}</Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Дни недели: </Text>
                    {(application.days && application.days.join(', ')) || 'N/A'}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Время: </Text>
                    {`с ${application.startTime || 'N/A'} до ${application.endTime || 'N/A'}`}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Предмет: </Text>
                    {application.subject || 'N/A'}
                </Text>
                <Text style={styles.info}>
                    <Text style={styles.label}>Педагог: </Text>
                    {application.teacher || 'N/A'}
                </Text>
            </View>
        </View>
    );
};

export default ApplicationCard;

const styles = StyleSheet.create({
    card: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#F4F4F4',
    },
    leftContainer: {
        justifyContent: 'flex-start',
        marginRight: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    buttonText: {
        marginLeft: 6,
        fontSize: 16,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    label: {
        fontWeight: '400',
        fontSize: 16,
    },
    info: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
});
