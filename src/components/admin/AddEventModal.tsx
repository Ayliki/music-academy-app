import React, {useState} from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import {collection, addDoc} from 'firebase/firestore';
import {db} from '../../services/firebaseConfig';
import {Image} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {styles} from '../../styles/AddEventStyles';

interface AddEventModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({visible, onClose}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Функция для обработки выбора изображения
    const handlePickPhoto = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
            setImage(result.assets[0].uri);
        }
    };

    // Функция для валидации даты (ДД.ММ.ГГГГ)
    const handleDateChange = (input: string) => {
        // Оставляем только цифры
        const cleanedInput = input.replace(/\D/g, '');

        let formattedDate = '';

        if (cleanedInput.length > 0) {
            formattedDate = cleanedInput.substring(0, 2);
        }
        if (cleanedInput.length > 2) {
            formattedDate += '.' + cleanedInput.substring(2, 4);
        }
        if (cleanedInput.length > 4) {
            formattedDate += '.' + cleanedInput.substring(4, 8);
        }

        setDate(formattedDate);
    };

    // Функция для валидации времени
    const handleTimeChange = (input: string) => {
        // Убираем все символы, кроме цифр
        const cleanedInput = input.replace(/\D/g, '');

        // Если нет цифр, сбрасываем время
        if (!cleanedInput) {
            setTime('');
            return;
        }

        let formattedTime = '';

        // Обработка часов
        if (cleanedInput.length >= 2) {
            const hours = cleanedInput.substring(0, 2);
            const hoursNum = parseInt(hours, 10);
            if (hoursNum > 23) {
                Alert.alert('Некорректное время', 'Часы не могут быть больше 23');
                return;
            }
            formattedTime = hours;
        } else {
            // Если введено меньше 2 цифр, просто используем их
            formattedTime = cleanedInput;
        }

        // Обработка минут, если они есть
        if (cleanedInput.length > 2) {
            // Берём либо 2 цифры, либо оставшиеся, если их меньше
            const minutes = cleanedInput.length >= 4 ? cleanedInput.substring(2, 4) : cleanedInput.substring(2);
            const minutesNum = parseInt(minutes, 10);
            if (minutesNum > 59) {
                Alert.alert('Некорректное время', 'Минуты не могут быть больше 59');
                return;
            }
            formattedTime += ':' + minutes;
        }

        setTime(formattedTime);
    };

    // Проверка, является ли дата и время прошедшими
    const isDateTimeValid = () => {
        const dateParts = date.split('.');
        const timeParts = time.split(':');

        if (dateParts.length !== 3 || timeParts.length !== 2) {
            Alert.alert('Ошибка', 'Введите дату и время в правильном формате');
            return false;
        }

        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0
        const year = parseInt(dateParts[2], 10);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);

        const eventDate = new Date(year, month, day, hours, minutes);
        const currentDate = new Date();

        if (eventDate < currentDate) {
            Alert.alert('Ошибка', 'Вы не можете выбрать прошедшую дату и время');
            return false;
        }

        return true;
    };

    // Функция для сохранения события
    const handleSave = async () => {
        if (!title || !date || !time) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        if (!isDateTimeValid()) return;

        // Закрываем модальное окно сразу
        onClose();

        try {
            setLoading(true);
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.popup}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>

                        <View style={styles.formRow}>
                            <TouchableOpacity onPress={handlePickPhoto} style={styles.photoPlaceholder}>
                                {image ? (
                                    <Image source={{uri: image}} style={styles.photoImage}/>
                                ) : (
                                    <Text style={styles.photoPlaceholderText}>Выбрать фото</Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.inputsContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Название:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Название"
                                        placeholderTextColor="#888"
                                        value={title}
                                        onChangeText={setTitle}
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Дата (ДД.ММ.ГГГГ):</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="10.02.2025"
                                        placeholderTextColor="#888"
                                        value={date}
                                        onChangeText={handleDateChange}
                                        keyboardType="number-pad"
                                    />
                                </View>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Время (ЧЧ:ММ):</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="14:00"
                                        placeholderTextColor="#888"
                                        value={time}
                                        onChangeText={handleTimeChange}
                                        keyboardType="number-pad"
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
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AddEventModal;

