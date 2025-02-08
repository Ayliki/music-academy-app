import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Event } from 'src/screens/EventsScreen';

interface EventCardProps {
    event: Event;
}

const eventImages: { [key: string]: any } = {
    'event1.png': require('../../assets/images/events/event1.png'),
};

const formatEventDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <View style={styles.card}>
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
    );
};

export default EventCard;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#EEEEEE',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        overflow: 'hidden',
        alignItems: 'flex-start',
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
        transform: [{ scale: 1 }],
    },
    cardContent: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    cardContentNoImage: {
        paddingTop: 16,
    },
    textLabelContainer: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    label: {
        fontWeight: '400',
        fontSize: 16,
        marginBottom: 5,
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
