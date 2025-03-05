import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
    },
    label: {
        fontFamily: 'Outfit',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 16,
        marginVertical: 8,
    },
    timeContainer: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    timeInput: {
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#6C6A6A',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        width: 328,
        minHeight: 48,
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 32,
        backgroundColor: '#98A7DD',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    inputGroup: {
        marginBottom: 2,
    },
    input: {
        height: 48,
        borderWidth: 1,
        maxHeight: 35,
        borderRadius: 15,
        paddingHorizontal: 12,
    },
});

export default styles;