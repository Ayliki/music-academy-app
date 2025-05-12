import React from 'react';
import {View, Text, Image} from 'react-native';
import {Event} from 'src/screens/EventsScreen';
import styles from '../styles/EventCardStyles';

interface EventCardProps {
    event: Event;
}


const getImageSource = (image: string) => {
    return {uri: image};
};


const EventCard: React.FC<EventCardProps> = ({event}) => {
    return (
        <View style={styles.card}>
            {event.image ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={getImageSource(event.image)}
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
                    <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <View style={styles.textLabelContainer}>
                    <Text style={styles.label}>Начало в {event.time}</Text>
                </View>
            </View>
        </View>
    );
};

export default EventCard;

