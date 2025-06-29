import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        minHeight: 300,
        minWidth: 250,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 4,
    },
    closeText: {
        fontSize: 30,
        color: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
        color: '#000',
    },
    formRow: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
    },
    photoPlaceholder: {
        width: '40%',
        aspectRatio: 1,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 10,
        marginTop: -40,
    },
    photoPlaceholderText: {
        padding: 4,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        color: '#000',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    inputsContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    inputGroup: {
        marginBottom: 2,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#000',
    },
    input: {
        height: 48,
        borderWidth: 1,
        maxHeight: 35,
        borderRadius: 15,
        paddingHorizontal: 12,
    },
    saveButton: {
        width: '70%',
        marginTop: 16,
        backgroundColor: '#43B39E',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});