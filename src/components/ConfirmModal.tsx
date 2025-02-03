import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    title,
    message,
    onClose,
    onConfirm,
}) => {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Text style={styles.modalText}>{message}</Text>
                    <View style={styles.modalButtonColumn}>
                        <TouchableOpacity style={styles.modalButtonCheck} onPress={onClose}>
                            <Text style={styles.checkBtnText}>Проверить</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtonSend} onPress={onConfirm}>
                            <Text style={styles.sendBtnText}>Отправить код</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 246,
        height: 265,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    closeText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 16,
    },
    modalText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
        fontFamily: 'Inter',
    },
    modalButtonColumn: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    modalButtonCheck: {
        backgroundColor: '#f0ad4e',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: 118,
        borderWidth: 1,
        borderColor: '#00A9E3',
        marginBottom: 16,
    },
    checkBtnText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
    },
    modalButtonSend: {
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        width: 118,
        borderWidth: 1,
        borderColor: '#9D9D9D',
    },
    sendBtnText: {
        fontFamily: 'Inter',
        fontWeight: '600',
        fontSize: 14,
        color: '#FFB400',
        textAlign: 'center',
    },
});

export default ConfirmModal;
