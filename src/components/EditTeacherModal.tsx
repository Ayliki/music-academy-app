import React, { useState, useEffect } from 'react';
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
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

interface EditTeacherModalProps {
    visible: boolean;
    onClose: () => void;
    teacher: {
        id: string;
        name: string;
        subject: string;
        photo: string;
    };
}

const teacherImages: { [key: string]: any } = {
    'teacher1.jpg': require('../../assets/images/teachers/teacher1.png'),
    'teacher2.jpg': require('../../assets/images/teachers/teacher2.png'),
    'teacher3.jpg': require('../../assets/images/teachers/teacher3.png'),
    'teacher4.jpg': require('../../assets/images/teachers/teacher4.png'),
    'teacher5.jpg': require('../../assets/images/teachers/teacher5.png'),
};

const EditTeacherModal: React.FC<EditTeacherModalProps> = ({ visible, onClose, teacher }) => {
    const [name, setName] = useState(teacher.name);
    const [subject, setSubject] = useState(teacher.subject);

    const [photo, setPhoto] = useState<string>(teacher.photo);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(teacher.name);
        setSubject(teacher.subject);
        setPhoto(teacher.photo);
    }, [teacher]);


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
        if (!name || !subject) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните имя и предмет');
            return;
        }
        try {
            setLoading(true);
            const teacherRef = doc(db, 'users', teacher.id);
            await updateDoc(teacherRef, {
                name,
                subject,
                photo: photo.trim() !== '' ? photo : null,
            });
            Alert.alert('Успех', 'Преподаватель обновлен');
            onClose();
        } catch (error: any) {
            console.error('Error updating teacher:', error);
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
                                <Image
                                    source={
                                        teacherImages.hasOwnProperty(photo)
                                            ? teacherImages[photo]
                                            : { uri: photo }
                                    }
                                    style={styles.photoImage}
                                    onError={() => setPhoto('')}
                                />

                            ) : (
                                <Text style={styles.photoPlaceholderText}>Выбрать фото</Text>
                            )}
                        </TouchableOpacity>
                        <View style={styles.inputsContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Введите Отображаемое имя:</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Имя"
                                    placeholderTextColor="#888"
                                    value={name}
                                    onChangeText={setName}
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

                </View>
            </View>
        </Modal>
    );
};

export default EditTeacherModal;

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
        justifyContent: 'space-between',
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
