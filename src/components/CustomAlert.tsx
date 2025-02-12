import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    onClose: () => void;
    role?: 'teacher' | 'administrator' | 'default';
    children?: React.ReactNode;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, onClose, role = 'default', children }) => {
    const okButtonBackgroundColor =
        role === 'teacher'
            ? '#314FBB'
            : role === 'administrator'
                ? '#4DD3BA'
                : '#98A7DD';

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.popup}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                    <View style={styles.contentContainer}>
                        {children ? (
                            children
                        ) : (
                            <Text style={styles.message}>Изменения успешно сохранены!</Text>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={onClose}
                        style={[styles.okButton, { backgroundColor: okButtonBackgroundColor }]}
                    >
                        <Text style={styles.okText}>Ок</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: '70%',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        minHeight: 150,
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 8,
    },
    closeText: {
        fontSize: 24,
        color: '#000',
    },
    contentContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    message: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 19.36,
        textAlign: 'center',
        color: '#666666',
    },
    okButton: {
        width: 118,
        height: 28,
        borderWidth: 1,
        borderColor: '#00A9E3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    okText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default CustomAlert;
