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
import {db} from '../../services/firebaseConfig';
import SingleSelectDropdown from '../SingleSelectDropdown';
import {styles} from '../../styles/AddGroupLessonModalStyles';

interface AddLessonModalProps {
    date: Date;
    visible: boolean;
    onClose: () => void;
}

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
        const cleanedInput = input.replace(/\D/g, '');
        if (!cleanedInput) {
            setStartTime('');
            return;
        }
        let formattedTime = '';
        if (cleanedInput.length >= 2) {
            const hours = cleanedInput.substring(0, 2);
            const hoursNum = parseInt(hours, 10);
            if (hoursNum > 23) {
                Alert.alert('Некорректное время', 'Часы не могут быть больше 23');
                return;
            }
            formattedTime = hours;
        } else {
            formattedTime = cleanedInput;
        }
        if (cleanedInput.length > 2) {
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

    // Функция для валидации времени окончания
    const handleEndTimeChange = (input: string) => {
        const cleanedInput = input.replace(/\D/g, '');
        if (!cleanedInput) {
            setEndTime('');
            return;
        }
        let formattedTime = '';
        if (cleanedInput.length >= 2) {
            const hours = cleanedInput.substring(0, 2);
            const hoursNum = parseInt(hours, 10);
            if (hoursNum > 23) {
                Alert.alert('Некорректное время', 'Часы не могут быть больше 23');
                return;
            }
            formattedTime = hours;
        } else {
            formattedTime = cleanedInput;
        }
        if (cleanedInput.length > 2) {
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

            // Проверка на конфликт занятий в выбранном кабинете на указанную дату
            const lessonsQuery = query(
                collection(db, 'lessons'),
                where('roomId', '==', selectedRoom),
                where('date', '==', formattedDate)
            );
            const lessonsSnapshot = await getDocs(lessonsQuery);
            const conflict = lessonsSnapshot.docs.some(doc => {
                const lesson = doc.data();
                if (!lesson.timeStart || !lesson.timeEnd) {
                    return false;
                }
                const existingStart = parseTimeToMinutes(lesson.timeStart);
                const existingEnd = parseTimeToMinutes(lesson.timeEnd);
                return startMinutes < existingEnd && endMinutes > existingStart;
            });
            if (conflict) {
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