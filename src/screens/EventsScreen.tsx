import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { NavigationProps } from '../navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';
import EventCard from 'src/components/EventCard';

export type Event = {
    id: string;
    title: string;
    date: string;
    image?: string;
    description?: string;
    location?: string;
};

const EventsScreen: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const navigation = useNavigation<NavigationProps>();

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderMenu title={"События"} onBack={() => navigation.navigate('Menu')} />
            <ScrollView contentContainerStyle={styles.eventsList}>
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </ScrollView>
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
});
