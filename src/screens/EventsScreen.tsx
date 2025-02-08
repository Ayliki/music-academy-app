import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { NavigationProps } from '../navigation/types';
import HeaderMenu from 'src/components/HeaderMenu';

export type Event = {
    id: string;
    title: string;
    date: string;
    image?: string;
    description?: string;
    location?: string;
};

const eventImages: { [key: string]: any } = {
    'event1.png': require('../../assets/images/events/event1.png'),
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
            <HeaderMenu title={"События"} onBack={() => { navigation.navigate('Menu') }} />

            {/* Events List */}
            <ScrollView contentContainerStyle={styles.eventsList}>
                {events.map(event => (
                    <View key={event.id} style={styles.card}>
                        {event.image ? (
                            <View style={styles.imageContainer}>
                                <Image
                                    source={eventImages[event.image]}
                                    style={styles.eventImage}
                                />
                            </View>
                        ) : null}
                        <View style={[styles.cardContent, !event.image && styles.cardContentNoImage]}>
                            <View style={styles.textLabelContainer}>
                                <Text style={styles.label}>Название:</Text>
                                <Text style={styles.eventTitle}>{event.title}</Text>
                            </View>
                            <View style={styles.textLabelContainer}>
                                <Text style={styles.label}>Дата проведения:</Text>
                                <Text style={styles.eventDate}>{formatEventDate(event.date)}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView >
    );
};

const formatEventDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
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
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#eee',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        overflow: 'hidden',
        alignItems: 'flex-start',
    },
    textLabelContainer: {
        flexDirection: 'column',
        marginBottom: 10
    },

    label: {
        fontWeight: '400',
        fontSize: 16,
        marginBottom: 5
    },
    imageContainer: {
        width: 150,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
    },
    eventImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        transform: [{ scale: 1 }]
    },
    cardContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    cardContentNoImage: {
        paddingTop: 16,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    eventDate: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
});
