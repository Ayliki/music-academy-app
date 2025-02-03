// Updated styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    academyText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    nameText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    container: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 12,
    },
    submitButton: {
        backgroundColor: '#FFD700',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginVertical: 24,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    loginLinkContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    loginLink: {
        fontSize: 14,
        color: '#666',
    },
    loginText: {
        color: '#000',
        fontWeight: '600',
    },
});