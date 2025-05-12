import React, {useState} from 'react';
import {
    Alert,
    Image,
    Keyboard,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {addDoc, collection} from 'firebase/firestore';
import {db} from '../../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import {styles} from '../../styles/AddEventStyles';
import {uploadImageAsync} from "../../utils/uploadImageAsync";

interface AddEventModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({visible, onClose}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date());
    const [image, setImage] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    // Обработка выбора изображения
    const handlePickPhoto = async () => {
        // Запрос разрешения на доступ к галерее
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Ошибка", "Требуется разрешение для доступа к галерее");
            return;
        }

        // Запуск выбора изображения из галереи
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        // Если пользователь выбрал изображение
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            try {
                // Загружаем изображение в облако
                const downloadURL = await uploadImageAsync(localUri);
                // Сохраняем URL
                setImage(downloadURL);
                Alert.alert("Успех", "Изображение успешно загружено в облако");
            } catch (error) {
                console.error("Ошибка загрузки изображения", error);
                console.log(JSON.stringify(error));
                Alert.alert("Ошибка", "Не удалось загрузить изображение");
            }
        }
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

    // Управление отображением модальных пикеров
    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);

    // Обработка выбора даты
    const handleConfirmDate = (selectedDate: Date) => {
        // Сравнение только дат (без времени) – сегодняшняя дата допустима
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosenDate = new Date(selectedDate);
        chosenDate.setHours(0, 0, 0, 0);
        if (chosenDate < today) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшую дату');
            hideDatePicker();
            return;
        }
        // Обновляем дату, сохраняя текущее время из state
        const updatedDate = new Date(selectedDate);
        updatedDate.setHours(date.getHours(), date.getMinutes());
        setDate(updatedDate);
        hideDatePicker();
    };

    // Обработка выбора времени
    const handleConfirmTime = (selectedTime: Date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        // Если дата сегодня – проверяем, чтобы время не было в прошлом
        if (date.toDateString() === new Date().toDateString() && updatedDate < new Date()) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшее время');
            hideTimePicker();
            return;
        }
        setDate(updatedDate);
        hideTimePicker();
    };

    // Общая проверка даты и времени перед сохранением
    const isDateTimeValid = () => {
        if (date < new Date()) {
            Alert.alert('Ошибка', 'Вы не можете выбрать прошедшую дату и время');
            return false;
        }
        return true;
    };

    // Сохранение события
    const handleSave = async () => {
        if (!title) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        if (!isDateTimeValid()) return;

        onClose();

        try {
            setLoading(true);
            const newEvent: any = {
                title,
                date: formatDate(date),
                time: formatTime(date),
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
            setDate(new Date());
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
                            <View style={styles.photoContainer}>
                                <TouchableOpacity onPress={handlePickPhoto} style={styles.photoPlaceholder}>
                                    {image ? (
                                        <Image source={{uri: image}} style={styles.photoImage}/>
                                    ) : (
                                        <Text style={styles.photoPlaceholderText}>Выбрать фото</Text>
                                    )}
                                </TouchableOpacity>
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