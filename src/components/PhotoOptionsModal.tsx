import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PhotoOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onAddFromGallery: () => void;
    onTakePhoto: () => void;
    onRemovePhoto: () => void;
    role?: 'teacher' | 'administrator' | 'default';
}

const PhotoOptionsModal: React.FC<PhotoOptionsModalProps> = ({
    visible,
    onClose,
    onAddFromGallery,
    onTakePhoto,
    onRemovePhoto,
    role,
}) => {

    let optionBtnColor = '#98A7DD';
    if (role === 'teacher') {
        optionBtnColor = '#314FBB';
    } else if (role === 'administrator') {
        optionBtnColor = '#4DD3BA'
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.popup}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Выберите вариант:</Text>
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity onPress={onAddFromGallery} style={[styles.optionButton, { backgroundColor: optionBtnColor }]}>
                            <Text style={styles.optionText}>Добавить из галереи</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onTakePhoto} style={[styles.optionButton, { backgroundColor: optionBtnColor }]}>
                            <Text style={styles.optionText}>Сделать фото</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onRemovePhoto} style={[styles.optionButton, { backgroundColor: optionBtnColor }]}>
                            <Text style={styles.optionText}>Удалить фото</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
        alignItems: 'center',
        minHeight: 200,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 4,
        marginBottom: 6,
    },
    closeText: {
        fontSize: 30,
        color: '#000',
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 19.36,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666666'
    },
    buttonsContainer: {
        width: '100%',
    },
    optionButton: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#00A9E3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
});

export default PhotoOptionsModal;
