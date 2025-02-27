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
} from 'react-native';
import {collection, getDocs, query, where, addDoc} from 'firebase/firestore';
import {db} from '../../services/firebaseConfig';
import SingleSelectDropdown from '../SingleSelectDropdown';
import {styles} from '../../styles/AddGroupLessonModalStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface AddLessonModalProps {
    date: Date;
    visible: boolean;
    onClose: () => void;
}

// Определяем рабочий график (для каждого дня недели).
// 0 - воскресенье, 1 - понедельник, ..., 6 - суббота.
const workingHours: { [key: number]: { start: string; end: string } | null } = {
    0: null, // Воскресенье — выходной
    1: { start: '13:00', end: '20:30' }, // Понедельник
    2: { start: '13:00', end: '20:30' }, // Вторник
    3: { start: '13:00', end: '20:30' }, // Среда
    4: { start: '13:00', end: '20:30' }, // Четверг
    5: { start: '13:00', end: '20:30' }, // Пятница
    6: { start: '10:00', end: '20:30' }, // Суббота
};

const AddGroupLessonModal: React.FC<AddLessonModalProps> = ({date, visible, onClose}) => {
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

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    // Функция для форматирования даты в формат "ГГГГ-ММ-ДД"
    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Функция для преобразования строки "ЧЧ:ММ" в минуты с начала дня
    const parseTimeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Форматирование времени в формат HH:mm
    const formatTime = (date: Date) => {
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        return `${hours}:${minutes}`;
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

    // Управление отображением модальных пикеров
    const showStartTimePicker = () => setStartTimePickerVisibility(true);
    const hideStartTimePicker = () => setStartTimePickerVisibility(false);
    const showEndTimePicker = () => setEndTimePickerVisibility(true);
    const hideEndTimePicker = () => setEndTimePickerVisibility(false);

    // Обработка выбора времени начала занятия
    const handleConfirmStartTime = (selectedTime: Date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());

        // Если дата сегодня – проверяем, чтобы время не было в прошлом
        if (date.toDateString() === new Date().toDateString() && updatedDate < new Date()) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшее время');
            hideStartTimePicker();
            return;
        }

        // Проверяем, что выбранный день не выходной и время попадает в рабочий диапазон
        const dayOfWeek = updatedDate.getDay();
        const daySchedule = workingHours[dayOfWeek];
        if (!daySchedule) {
            Alert.alert('Ошибка', 'В этот день занятий нет (выходной)');
            hideStartTimePicker();
            return;
        }

        const selectedTimeMinutes = updatedDate.getHours() * 60 + updatedDate.getMinutes();
        const dayStartMinutes = parseTimeToMinutes(daySchedule.start);
        const dayEndMinutes = parseTimeToMinutes(daySchedule.end);

        if (selectedTimeMinutes < dayStartMinutes || selectedTimeMinutes > dayEndMinutes) {
            Alert.alert(
                'Ошибка',
                `Можно выбрать время только в промежутке ${daySchedule.start} - ${daySchedule.end}`
            );
            hideStartTimePicker();
            return;
        }

        setStartTime(formatTime(updatedDate));
        hideStartTimePicker();
    };

    // Обработка выбора времени конца занятия
    const handleConfirmEndTime = (selectedTime: Date) => {
        const updatedDate = new Date(date);
        updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());

        // Если дата сегодня – проверяем, чтобы время не было в прошлом
        if (date.toDateString() === new Date().toDateString() && updatedDate < new Date()) {
            Alert.alert('Ошибка', 'Нельзя выбрать прошедшее время');
            hideEndTimePicker();
            return;
        }

        // Проверяем, что выбранный день не выходной и время попадает в рабочий диапазон
        const dayOfWeek = updatedDate.getDay();
        const daySchedule = workingHours[dayOfWeek];
        if (!daySchedule) {
            Alert.alert('Ошибка', 'В этот день занятий нет (выходной)');
            hideEndTimePicker();
            return;
        }

        const selectedTimeMinutes = updatedDate.getHours() * 60 + updatedDate.getMinutes();
        const dayStartMinutes = parseTimeToMinutes(daySchedule.start);
        const dayEndMinutes = parseTimeToMinutes(daySchedule.end);

        if (selectedTimeMinutes < dayStartMinutes || selectedTimeMinutes > dayEndMinutes) {
            Alert.alert(
                'Ошибка',
                `Можно выбрать время только в промежутке ${daySchedule.start} - ${daySchedule.end}`
            );
            hideEndTimePicker();
            return;
        }

        setEndTime(formatTime(updatedDate));
        hideEndTimePicker();
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
            const formattedDate = formatDate(date);

            // Проверка на конфликт занятий у выбранного учителя на указанную дату
            const teacherLessonsQuery = query(
                collection(db, 'lessons'),
                where('teacherId', '==', selectedTeacher),
                where('date', '==', formattedDate)
            );
            const teacherLessonsSnapshot = await getDocs(teacherLessonsQuery);
            const teacherConflict = teacherLessonsSnapshot.docs.some(doc => {
                const lesson = doc.data();
                if (!lesson.timeStart || !lesson.timeEnd) {
                    return false;
                }
                const existingStart = parseTimeToMinutes(lesson.timeStart);
                const existingEnd = parseTimeToMinutes(lesson.timeEnd);
                return startMinutes < existingEnd && endMinutes > existingStart;
            });
            if (teacherConflict) {
                Alert.alert('Ошибка', 'У выбранного учителя уже запланировано занятие на это время');
                setLoading(false);
                return;
            }

            // Проверка на конфликт занятий в выбранном кабинете на указанную дату
            const lessonsQuery = query(
                collection(db, 'lessons'),
                where('roomId', '==', selectedRoom),
                where('date', '==', formattedDate)
            );
            const lessonsSnapshot = await getDocs(lessonsQuery);
            const roomConflict = lessonsSnapshot.docs.some(doc => {
                const lesson = doc.data();
                if (!lesson.timeStart || !lesson.timeEnd) {
                    return false;
                }
                const existingStart = parseTimeToMinutes(lesson.timeStart);
                const existingEnd = parseTimeToMinutes(lesson.timeEnd);
                return startMinutes < existingEnd && endMinutes > existingStart;
            });
            if (roomConflict) {
                Alert.alert('Ошибка', 'На это время уже запланировано занятие в этом кабинете');
                setLoading(false);
                return;
            }

            const lessonData = {
                subjectId: selectedSubject,
                teacherId: selectedTeacher,
                groupId: selectedGroup,
                roomId: selectedRoom,
                timeStart: startTime,
                timeEnd: endTime,
                date: formattedDate,
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

                        <SingleSelectDropdown
                            options={subjects}
                            selectedOption={selectedSubject}
                            onSelectionChange={(id) => setSelectedSubject(id)}
                            placeholder="Выберите предмет"
                            label="Предмет:"
                        />

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

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Время начала (ЧЧ:ММ):</Text>
                            <TouchableOpacity onPress={showStartTimePicker} style={styles.input}>
                                <Text style={{color: '#000'}}>
                                    {startTime ? startTime : formatTime(date)}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isStartTimePickerVisible}
                                mode="time"
                                onConfirm={handleConfirmStartTime}
                                onCancel={hideStartTimePicker}
                                confirmTextIOS={"Подтвердить"}
                                cancelTextIOS={"Отменить"}
                                pickerContainerStyleIOS={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Время окончания (ЧЧ:ММ):</Text>
                            <TouchableOpacity onPress={showEndTimePicker} style={styles.input}>
                                <Text style={{color: '#000'}}>
                                    {endTime ? endTime : formatTime(date)}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isEndTimePickerVisible}
                                mode="time"
                                onConfirm={handleConfirmEndTime}
                                onCancel={hideEndTimePicker}
                                confirmTextIOS={"Подтвердить"}
                                cancelTextIOS={"Отменить"}
                                pickerContainerStyleIOS={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
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