import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { NavigationProps } from '../navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';
import EventCard from 'src/components/EventCard';
import { useAuth } from 'src/context/AuthContext';
import AddEventModal from '../components/admin/AddEventModal';
import EditEventModal from '../components/admin/EditEventModal';

export type Event = {
    id: string;
    title: string;
    date: string;
    time: string;
    image?: string;
    description?: string;
    location?: string;
};

const EventsScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const navigation = useNavigation<NavigationProps>();
    const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
    const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const { role } = useAuth();

    useEffect(() => {
        const eventsCol = collection(db, 'events');
        const unsubscribe = onSnapshot(eventsCol, (snapshot) => {
            const eventsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Event[];
            setEvents(eventsData);
        });
        return () => unsubscribe();
    }, []);

    const handleEditEvent = (id: string) => {
        setSelectedEventId(id);
        setIsEditEventModalVisible(true);
    };

    const handleDeleteEvent = (id: string) => {
        Alert.alert(
            "Вы точно хотите удалить событие?",
            "Это действие нельзя будет отменить.",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Удалить",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'events', id));
                        } catch (error: any) {
                            console.error('Error deleting event:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить событие');
                        }
                    },
                    style: "destructive",
                }
            ]
        );
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderMenu title="События" onBack={handleBack} />
            <ScrollView contentContainerStyle={styles.eventsList}>
                {events.map((event) => (
                    <View key={event.id} style={styles.eventContainer}>
                        <EventCard event={event} />
                        {role === 'administrator' && (
                            <View style={styles.editIcon}>
                                <TouchableOpacity
                                    style={styles.editIcon}
                                    onPress={() => handleEditEvent(event.id)}
                                >
                                    <Ionicons name="create" size={24} color="blue" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteIcon}
                                    onPress={() => handleDeleteEvent(event.id)}
                                >
                                    <Ionicons name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
                {role === 'administrator' && (
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setIsAddEventModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>Добавить событие</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            {role === 'administrator' && (
                <AddEventModal
                    visible={isAddEventModalVisible}
                    onClose={() => setIsAddEventModalVisible(false)}
                />
            )}

            {role === 'administrator' && selectedEventId && (
                <EditEventModal
                    eventId={selectedEventId}
                    visible={isEditEventModalVisible}
                    onClose={() => setIsEditEventModalVisible(false)}
                />
            )}
        </SafeAreaView>
    );
};

export default EventsScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    eventsList: {
        padding: 16,
    },
    eventContainer: {
        marginBottom: 16,
        position: 'relative',
    },
    editIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 16,
        padding: 4,
    },
    deleteIcon: {
        position: 'absolute',
        top: 160,
        right: 8,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 16,
        padding: 4,
    },
    addButton: {
        marginTop: 16,
        marginBottom: 32,
        backgroundColor: '#4DD3BA',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
