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
    const [image, setImage] = useState<string | undefined>(undefined);
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
            const newEvent = {
                title,
                date,
                time,
                image,
                description: '',
                location: '',
            };
            await addDoc(collection(db, 'events'), newEvent);
            Alert.alert('Успех', 'Событие добавлено');
            onClose(); // Close the modal after saving.
            // Optionally, clear the form:
            setTitle('');
            setDate('');
            setTime('');
            setImage(undefined);
        } catch (error: any) {
            console.error('Error saving event:', error);
            Alert.alert('Ошибка', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={addModalStyles.modalContainer}>
                <View style={addModalStyles.popup}>
                    <TouchableOpacity onPress={onClose} style={addModalStyles.closeButton}>
                        <Text style={addModalStyles.closeText}>×</Text>
                    </TouchableOpacity>
                    <Text style={addModalStyles.title}>Добавить событие</Text>
                    <TextInput
                        style={addModalStyles.input}
                        placeholder="Название"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={addModalStyles.input}
                        placeholder="Дата (например, 2025-02-10)"
                        value={date}
                        onChangeText={setDate}
                    />
                    <TextInput
                        style={addModalStyles.input}
                        placeholder="Время (например, 14:00)"
                        value={time}
                        onChangeText={setTime}
                    />
                    <TouchableOpacity onPress={handlePickPhoto} style={addModalStyles.photoButton}>
                        <Text style={addModalStyles.photoButtonText}>Добавить фото</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={addModalStyles.saveButton}>
                        <Text style={addModalStyles.saveButtonText}>
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddEventModal;

const addModalStyles = StyleSheet.create({
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
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
        color: '#000',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 0.7,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
    },
    photoButton: {
        marginVertical: 8,
        backgroundColor: '#E9F4EF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    photoButtonText: {
        color: '#4DC591',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        marginTop: 16,
        backgroundColor: '#00A9E3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
