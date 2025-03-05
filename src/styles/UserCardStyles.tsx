import {StyleSheet} from "react-native";

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
        shadowOffset: {width: 0, height: 2},
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
        fontWeight: '600',
        marginRight: 6,
    }
});

export default styles;