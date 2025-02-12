import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import CustomAlert from './CustomAlert';

interface AddTeacherModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddTeacherModal: React.FC<AddTeacherModalProps> = ({ visible, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');
    const [subject, setSubject] = useState('');
    const [photo, setPhoto] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const handlePickPhoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Ошибка', 'Требуется разрешение для доступа к галерее');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!fullName || !subject) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните имя и предмет');
            return;
        }
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ');
        try {
            setLoading(true);
            const newTeacher = {
                firstName,
                lastName,
                selection: subject,
                photo: photo.trim() !== '' ? photo : null,
                role: 'teacher',
            };
            await addDoc(collection(db, 'users'), newTeacher);
            onClose();
            setFullName('')
            setSubject('');
            setPhoto('');
        } catch (error: any) {
            console.error('Error adding teacher:', error);
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
                        <TouchableOpacity onPress={handlePickPhoto} style={styles.photoPlaceholder}>
                            {photo ? (
                                <Image source={{ uri: photo }} style={styles.photoImage} onError={() => setPhoto('')} />
                            ) : (
                                <Text style={styles.photoPlaceholderText}>Выбрать фото</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.inputsContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Введите имя:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Имя"
                                    placeholderTextColor="#888"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Введите предмет:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Предмет"
                                    placeholderTextColor="#888"
                                    value={subject}
                                    onChangeText={setSubject}
                                />
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Сохранение...' : 'Сохранить'}
                        </Text>
                    </TouchableOpacity>
                    {isAlertVisible && (
                        <CustomAlert onClose={() => setIsAlertVisible(false)} visible={isAlertVisible} role="administrator" />
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default AddTeacherModal;

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
    formRow: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
        alignItems: 'flex-start',
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
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: '#000',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginVertical: 8,
        fontSize: 16,
    },
    saveButton: {
        width: '70%',
        marginTop: 16,
        backgroundColor: '#43B39E',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
