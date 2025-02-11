import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

interface AddEventModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ visible, onClose }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState<string>(''); // Initialized as empty string
    const [loading, setLoading] = useState(false);

    const handlePickPhoto = async () => {
        Alert.alert('Функция выбора фото пока не реализована');
    };

    const handleSave = async () => {
        if (!title || !date || !time) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }
        try {
            setLoading(true);
            // Build event object, omitting image if empty.
            const newEvent: any = {
                title,
                date,
                time,
                description: '',
                location: '',
            };
            if (image.trim() !== '') {
                newEvent.image = image;
            }
            await addDoc(collection(db, 'events'), newEvent);
            Alert.alert('Успех', 'Событие добавлено');
            onClose();
            // Clear the form:
            setTitle('');
            setDate('');
            setTime('');
            setImage('');
        } catch (error: any) {
            console.error('Error saving event:', error);
            Alert.alert('Ошибка', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.popup}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>×</Text>
                    </TouchableOpacity>

                    <View style={styles.formRow}>
                        <TouchableOpacity
                            onPress={handlePickPhoto}
                            style={styles.photoPlaceholder}
                        >
                            {image ? (
                                <Text style={styles.photoPlaceholderText}>Фото выбрано</Text>
                            ) : (
                                <Text style={styles.photoPlaceholderText}>Добавить фото</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.inputsContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Название:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Название"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Дата:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="2025-02-10"
                                    value={date}
                                    onChangeText={setDate}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Время:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="14:00"
                                    value={time}
                                    onChangeText={setTime}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddEventModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        minHeight: 300,
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
    },
    photoPlaceholderText: {
        padding: 4,
        fontSize: 16,
        fontWeight: 400,
        textAlign: 'center',
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
        maxHeight: 40,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
