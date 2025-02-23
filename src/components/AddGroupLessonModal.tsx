import React, {useState, useEffect} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import {collection, getDocs, query, where, addDoc} from 'firebase/firestore';
import {db} from '../services/firebaseConfig';
import SingleSelectDropdown from './SingleSelectDropdown';
import {styles} from '../styles/AddGroupModalStyles';

interface AddLessonModalProps {
    visible: boolean;
    onClose: () => void;
}

const AddGroupLessonModal: React.FC<AddLessonModalProps> = ({visible, onClose}) => {
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Функция для преобразования строки "ЧЧ:ММ" в минуты с начала дня
    const parseTimeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Загрузка предметов при монтировании компонента
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
                const subjectsData = subjectsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setSubjects(subjectsData);
            } catch (error) {
                console.error('Ошибка при загрузке предметов: ', error);
                Alert.alert('Ошибка', 'Не удалось загрузить предметы');
            }
        };

        fetchSubjects();
    }, []);

    // Загрузка преподавателей при выборе предмета
    useEffect(() => {
        if (!selectedSubject) {
            setTeachers([]);
            setSelectedTeacher('');
            return;
        }

        const fetchTeachers = async () => {
            try {
                const teachersQuery = query(
                    collection(db, 'users'),
                    where('subjectId', '==', selectedSubject)
                );
                const teachersSnapshot = await getDocs(teachersQuery);
                const teachersData = teachersSnapshot.docs.map(doc => {
                    const user = doc.data();
                    const fullName = `${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`.trim();
                    return {
                        id: doc.id,
                        name: fullName,
                    };
                });
                setTeachers(teachersData);
            } catch (error) {
                console.error('Ошибка при загрузке преподавателей: ', error);
                Alert.alert('Ошибка', 'Не удалось загрузить преподавателей');
            }
        };

        fetchTeachers();
    }, [selectedSubject]);

    // Загрузка групп при выборе учителя
    useEffect(() => {
        if (!selectedTeacher) {
            setGroups([]);
            setSelectedGroup('');
            return;
        }

        const fetchGroups = async () => {
            try {
                const groupsSnapshot = await getDocs(collection(db, 'groups'));
                const groupsData = groupsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setGroups(groupsData);
            } catch (error) {
                console.error('Ошибка при загрузке групп: ', error);
                Alert.alert('Ошибка', 'Не удалось загрузить группы');
            }
        };

        fetchGroups();
    }, [selectedTeacher]);

    // Загрузка кабинетов при выборе группы
    useEffect(() => {
        if (!selectedGroup) {
            setRooms([]);
            setSelectedRoom('');
            return;
        }

        const fetchRooms = async () => {
            try {
                const roomsSnapshot = await getDocs(collection(db, 'rooms'));
                const roomsData = roomsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                }));
                setRooms(roomsData);
            } catch (error) {
                console.error('Ошибка при загрузке кабинетов: ', error);
                Alert.alert('Ошибка', 'Не удалось загрузить кабинеты');
            }
        };
        fetchRooms();
    }, [selectedGroup]);

    // Функция для валидации времени начала
    const handleStartTimeChange = (input: string) => {
        // Убираем все символы, кроме цифр
        const cleanedInput = input.replace(/\D/g, '');

        // Если нет цифр, сбрасываем время
        if (!cleanedInput) {
            setStartTime('');
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

        setStartTime(formattedTime);
    };

    // Функция для валидации времени
    const handleEndTimeChange = (input: string) => {
        // Убираем все символы, кроме цифр
        const cleanedInput = input.replace(/\D/g, '');

        // Если нет цифр, сбрасываем время
        if (!cleanedInput) {
            setEndTime('');
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

        setEndTime(formattedTime);
    };

    // Функция для сохранения данных
    const handleSave = async () => {
        if (!selectedSubject || !selectedTeacher || !selectedGroup || !selectedRoom) {
            Alert.alert('Ошибка', 'Пожалуйста, выберите все поля');
            return;
        }

        if (!startTime || !endTime) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите время начала и окончания занятия');
            return;
        }

        // Проверка формата времени (ЧЧ:ММ)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            Alert.alert('Ошибка', 'Время должно быть в формате ЧЧ:ММ');
            return;
        }

        const startMinutes = parseTimeToMinutes(startTime);
        const endMinutes = parseTimeToMinutes(endTime);
        if (endMinutes <= startMinutes) {
            Alert.alert('Ошибка', 'Время окончания должно быть больше времени начала');
            return;
        }

        setLoading(true);

        try {
            // Получаем сегодняшнюю дату в формате ГГГГ-ММ-ДД
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            // Проверка на конфликт занятий в этом кабинете на сегодня в указанное время
            const lessonsQuery = query(
                collection(db, 'lessons'),
                where('roomId', '==', selectedRoom),
                where('date', '==', todayStr)
            );
            const lessonsSnapshot = await getDocs(lessonsQuery);
            const conflict = lessonsSnapshot.docs.some(
                doc => {
                    const lesson = doc.data();
                    if (!lesson.startTime || !lesson.endTime) {
                        return false;
                    }
                    const existingStart = parseTimeToMinutes(lesson.startTime);
                    const existingEnd = parseTimeToMinutes(lesson.endTime);
                    // Проверяем, пересекается ли интервал нового занятия с уже запланированным
                    return startMinutes < existingEnd && endMinutes > existingStart;
                }
            );
            if (conflict) {
                Alert.alert('Ошибка', 'На это время уже запланировано занятие в этом кабинете');
                setLoading(false);
                return;
            }

            // Формируем объект данных урока с добавлением времени и даты
            const lessonData = {
                subjectId: selectedSubject,
                teacherId: selectedTeacher,
                groupId: selectedGroup,
                roomId: selectedRoom,
                timeStart: startTime,
                timeEnd: endTime,
                date: todayStr,
            };

            await addDoc(collection(db, 'lessons'), lessonData);
            Alert.alert('Успех', 'Урок успешно добавлен');

            // Очистка полей после сохранения
            setSelectedSubject('');
            setSelectedTeacher('');
            setSelectedGroup('');
            setSelectedRoom('');
            setStartTime('');
            setEndTime('');
            onClose();

        } catch (error: any) {
            console.error('Ошибка при сохранении урока: ', error);
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

                        {/* Выпадающий список для выбора предмета */}
                        <SingleSelectDropdown
                            options={subjects}
                            selectedOption={selectedSubject}
                            onSelectionChange={(id) => setSelectedSubject(id)}
                            placeholder="Выберите предмет"
                            label="Предмет:"
                        />

                        {/* Если предмет не выбран, остальные поля становятся недоступными */}
                        <View pointerEvents={selectedSubject ? 'auto' : 'none'}
                              style={{opacity: selectedSubject ? 1 : 0.5}}>
                            <SingleSelectDropdown
                                options={teachers}
                                selectedOption={selectedTeacher}
                                onSelectionChange={(id) => setSelectedTeacher(id)}
                                placeholder="Выберите преподавателя"
                                label="Преподаватель:"
                            />
                        </View>

                        <View pointerEvents={selectedTeacher ? 'auto' : 'none'}
                              style={{opacity: selectedTeacher ? 1 : 0.5}}>
                            <SingleSelectDropdown
                                options={groups}
                                selectedOption={selectedGroup}
                                onSelectionChange={(id) => setSelectedGroup(id)}
                                placeholder="Выберите группу"
                                label="Группа:"
                            />
                        </View>

                        <View pointerEvents={selectedGroup ? 'auto' : 'none'}
                              style={{opacity: selectedGroup ? 1 : 0.5}}>
                            <SingleSelectDropdown
                                options={rooms}
                                selectedOption={selectedRoom}
                                onSelectionChange={(id) => setSelectedRoom(id)}
                                placeholder="Выберите кабинет"
                                label="Кабинет:"
                            />
                        </View>

                        {/* Поля для ввода времени начала и окончания занятия */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Время начала (ЧЧ:ММ):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="14:00"
                                placeholderTextColor="#888"
                                value={startTime}
                                onChangeText={handleStartTimeChange}
                                keyboardType="number-pad"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Время окончания (ЧЧ:ММ):</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="14:00"
                                placeholderTextColor="#888"
                                value={endTime}
                                onChangeText={handleEndTimeChange}
                                keyboardType="number-pad"
                            />
                        </View>

                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            {loading ? (
                                <ActivityIndicator color="#fff"/>
                            ) : (
                                <Text style={styles.saveButtonText}>Сохранить</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default AddGroupLessonModal;