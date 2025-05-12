import {StyleSheet} from "react-native";

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
        shadowOffset: {width: 0, height: 2},
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
        transform: [{scale: 1}],
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

export default styles;