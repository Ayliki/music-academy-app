import {StyleSheet} from "react-native";

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 24,
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000',
        textAlign: 'center',
        width: 208,
        marginBottom: 24,
        lineHeight: 24,
    },
    label: {
        marginBottom: 8,
        fontFamily: 'Outfit',
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    input: {
        width: 328,
        borderWidth: 0.6,
        borderColor: '#6C6A6A',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
        fontSize: 15,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginBottom: 12,
    },
    pickerContainer: {
        width: 328,
        height: 52,
        borderWidth: 2,
        borderColor: '#FFB400',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    submitButton: {
        width: 328,
        backgroundColor: '#FFC72C',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 24,
    },
    submitButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLinkContainer: {
        alignItems: 'center',
    },
    loginLink: {
        fontSize: 18,
        color: '#666',
    },
    loginText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline',
    },
    link: {
        fontFamily: 'Outfit',
        fontSize: 18,
        color: '#AB8104',
        fontWeight: '700',
        textAlign: 'center',
    },
});

export default styles;