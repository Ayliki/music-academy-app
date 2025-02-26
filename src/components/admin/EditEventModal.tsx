import React, {useState, useEffect} from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {doc, getDoc, updateDoc} from 'firebase/firestore';
import {db} from '../../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import {styles} from '../../styles/AddEventStyles';

interface EditEventModalProps {
    eventId: string;
    visible: boolean;
    onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({eventId, visible, onClose}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

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
        if (!result.canceled && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    // Функция для удаления изображения
    const handleRemovePhoto = () => {
        setImage('');
    };

    // Форматирование даты в формат DD.MM.YYYY
    const formatDate = (date: Date) => {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Форматирование времени в формат HH:mm
    const formatTime = (date: Date) => {
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
    };

    // Парсинг даты и времени из строк event.date и event.time
    const parseDateTime = (dateString: string, timeString: string): Date => {
        const [day, month, year] = dateString.split('.');
        const [hours, minutes] = timeString.split(':');
        return new Date(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            parseInt(hours, 10),
            parseInt(minutes, 10)
        );
    };

    useEffect(() => {
        if (eventId) {
            fetchEventData();
        }
    }, [eventId]);

    const fetchEventData = async () => {
        try {
            const eventRef = doc(db, 'events', eventId);
            const eventSnap = await getDoc(eventRef);
            if (eventSnap.exists()) {
                const eventData = eventSnap.data();
                setTitle(eventData.title);
                if (eventData.date && eventData.time) {
                    const combinedDate = parseDateTime(eventData.date, eventData.time);
                    setDate(combinedDate);
                } else {
                    setDate(new Date());
                }
                setImage(eventData.image || '');
            } else {
                Alert.alert('Ошибка', 'Событие не найдено');
                onClose();
            }
        } catch (error) {
            console.error('Ошибка загрузки события:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить данные события');
        } finally {
            setIsLoading(false);
        }
    };

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);

    const handleConfirmDate = (selectedDate: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosenDate = new Date(selectedDate);
        chosenDate.setHours(0, 0, 0, 0);
        if (chosenDate < today) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшую дату');
            hideDatePicker();
            return;
        }
        const updatedDate = new Date(selectedDate);
        updatedDate.setHours(date.getHours(), date.getMinutes());
        setDate(updatedDate);
        hideDatePicker();
    };

    const handleConfirmTime = (selectedTime: Date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        if (date.toDateString() === new Date().toDateString() && updatedDate < new Date()) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшее время');
            hideTimePicker();
            return;
        }
        setDate(updatedDate);
        hideTimePicker();
    };

    const handleSave = async () => {
        if (!title) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        setIsSaving(true);
        try {
            const eventRef = doc(db, 'events', eventId);
            await updateDoc(eventRef, {
                title,
                date: formatDate(date),
                time: formatTime(date),
                image,
            });
            Alert.alert('Успех', 'Событие обновлено');
            onClose();
        } catch (error) {
            console.error('Ошибка обновления события:', error);
            Alert.alert('Ошибка', 'Не удалось обновить событие');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#000"/>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContainer}>
                    <View style={styles.popup}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>×</Text>
                        </TouchableOpacity>

                        <View style={styles.formRow}>
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={handlePickPhoto} style={styles.photoPlaceholder}>
                                    {image ? (
                                        <Image source={{uri: image}} style={styles.photoImage}/>
                                    ) : (
                                        <Text style={styles.photoPlaceholderText}>Выбрать фото</Text>
                                    )}
                                </TouchableOpacity>
                                {image && (
                                    <TouchableOpacity onPress={handleRemovePhoto} style={styles.removeButton}>
                                        <Text style={styles.removeButtonText}>Удалить фото</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

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
                                    <Text style={styles.label}>Дата:</Text>
                                    <TouchableOpacity onPress={showDatePicker} style={styles.input}>
                                        <Text style={{color: '#000'}}>{formatDate(date)}</Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirmDate}
                                        onCancel={hideDatePicker}
                                        minimumDate={new Date()}
                                        confirmTextIOS={"Подтвердить"}
                                        cancelTextIOS={"Отменить"}
                                        pickerContainerStyleIOS={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Время:</Text>
                                    <TouchableOpacity onPress={showTimePicker} style={styles.input}>
                                        <Text style={{color: '#000'}}>{formatTime(date)}</Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isTimePickerVisible}
                                        mode="time"
                                        onConfirm={handleConfirmTime}
                                        onCancel={hideTimePicker}
                                        confirmTextIOS={"Подтвердить"}
                                        cancelTextIOS={"Отменить"}
                                        pickerContainerStyleIOS={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>
                                {isSaving ? 'Сохранение...' : 'Сохранить'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default EditEventModal;