import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import HeaderMenu from '../components/HeaderMenu';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import SingleSelectDropdown from '../components/SingleSelectDropdown';
import CustomAlert from '../components/CustomAlert';
import {addDoc, collection, getDocs, query, where} from 'firebase/firestore';
import {db} from 'src/services/firebaseConfig';
import {useUserData} from 'src/hooks/useUserData';
import styles from '../styles/ApplicationStyles';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const ApplicationScreen: React.FC = () => {
    const navigation = useNavigation();
    const {userData} = useUserData();

    const [alertVisible, setAlertVisible] = useState(false);

    // Dropdown state для "День недели"
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

    // Временной промежуток (начинаем с пустых строк, чтобы показывать placeholder)
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState('');

    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');

    const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

    // Управление отображением модальных пикеров
    const showStartTimePicker = () => setStartTimePickerVisibility(true);
    const hideStartTimePicker = () => setStartTimePickerVisibility(false);
    const showEndTimePicker = () => setEndTimePickerVisibility(true);
    const hideEndTimePicker = () => setEndTimePickerVisibility(false);

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

    // Обработка выбора времени начала занятия
    const handleConfirmStartTime = (selectedTime: Date) => {
        const formatted = formatTime(selectedTime);
        setStartTime(formatted);
        hideStartTimePicker();
    };

    // Обработка выбора времени конца занятия с проверкой, что оно больше времени начала
    const handleConfirmEndTime = (selectedTime: Date) => {
        if (!startTime) {
            Alert.alert("Ошибка", "Сначала выберите время начала");
            hideEndTimePicker();
            return;
        }
        const formatted = formatTime(selectedTime);
        if (parseTimeToMinutes(formatted) <= parseTimeToMinutes(startTime)) {
            Alert.alert("Ошибка", "Время окончания должно быть больше времени начала");
            hideEndTimePicker();
            return;
        }
        setEndTime(formatted);
        hideEndTimePicker();
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
                    where('subjectId', '==', selectedSubject),
                    where('confirmed', '==', true)
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

    const handleSubmit = async () => {
        // Проверка, что все поля заполнены
        if (
            selectedDays.length === 0 ||
            !startTime.trim() ||
            !endTime.trim() ||
            !selectedSubject.trim() ||
            !selectedTeacher.trim()
        ) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        try {
            await addDoc(collection(db, 'applications'), {
                days: selectedDays,
                startTime,
                endTime,
                studentId: userData?.email,
                subjectId: selectedSubject,
                teacherId: selectedTeacher,
                confirmed: false,
                createdAt: new Date(),
            });
            setAlertVisible(true);
            // Очистка всех выбранных данных после успешного сохранения
            setSelectedDays([]);
            setStartTime('');
            setEndTime('');
            setSelectedSubject('');
            setTeachers([]);
            setSelectedTeacher('');
        } catch (error: any) {
            console.error('Error saving application:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderMenu title={'Подать заявку на И/З'} onBack={() => navigation.goBack()}/>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Выбор дня недели */}
                <MultiSelectDropdown
                    label="День недели"
                    options={days}
                    selectedOptions={selectedDays}
                    onSelectionChange={setSelectedDays}
                    placeholder="Выберите день недели"
                />

                {/* Временной промежуток */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Время начала (ЧЧ:ММ):</Text>
                    <TouchableOpacity onPress={showStartTimePicker} style={[styles.input, {opacity: startTime ? 1 : 0.5}]}>
                        <Text style={{color: startTime ? '#000' : '#aaa'}}>
                            {startTime ? startTime : 'Выберите время начала'}
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
                    <TouchableOpacity
                        onPress={() => {
                            if (!startTime) {
                                Alert.alert("Ошибка", "Сначала выберите время начала");
                            } else {
                                showEndTimePicker();
                            }
                        }}
                        style={[styles.input, {opacity: startTime && endTime ? 1 : 0.5}]}
                    >
                        <Text style={{color: startTime && endTime ? '#000' : '#aaa'}}>
                            {endTime ? endTime : 'Выберите время окончания'}
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

                {/* Выбор предмета из Firestore */}
                <SingleSelectDropdown
                    options={subjects}
                    selectedOption={selectedSubject}
                    onSelectionChange={(id) => setSelectedSubject(id)}
                    placeholder="Выберите предмет"
                    label="Предмет:"
                />

                {/* Выбор преподавателя с фильтрацией по выбранному предмету */}
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

                {/* Кнопка отправки заявки */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Отправить заявку</Text>
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert visible={alertVisible} onClose={() => setAlertVisible(false)}/>
        </SafeAreaView>
    );
};

export default ApplicationScreen;