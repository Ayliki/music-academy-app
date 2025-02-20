import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
} from 'react-native';
import {doc, setDoc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigation/types';
import {useLessons} from '../hooks/useLessons';
import ScheduleHeader from '../components/ScheduleHeader';
import ScheduleDatePicker from '../components/ScheduleDatePicker';
import ScheduleTable, {Lesson} from '../components/ScheduleTable';
import {db} from '../services/firebaseConfig';
import {useAuth} from 'src/context/AuthContext';
import AddGroupLesson from "../components/AddGroupLesson";
import AddIndividualLesson from "../components/AddIndividualLesson";

const generateDateOptions = (baseDate: Date): string[] => {
    const options: string[] = [];
    for (let i = 0; i < 20; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        const weekday = d
            .toLocaleDateString('ru-RU', {weekday: 'short'})
            .replace(/[.,]/g, '')
            .trim();
        const day = d.getDate();
        const month = d
            .toLocaleDateString('ru-RU', {month: 'short'})
            .replace(/[.,]/g, '')
            .trim();
        options.push(`${weekday} ${day} ${month}`);
    }
    return options;
};

const ScheduleScreen: React.FC = () => {
    const {lessons, setLessons} = useLessons();
    const navigation = useNavigation<NavigationProps>();
    const {role} = useAuth();

    const today = new Date();
    const todayNum = today.getDate();
    const todayMonth = today
        .toLocaleDateString('ru-RU', {month: 'short'})
        .replace(/[.,]/g, '')
        .trim();
    const todayWeekday = today
        .toLocaleDateString('ru-RU', {weekday: 'short'})
        .replace(/[.,]/g, '')
        .trim();
    const defaultSelected = `${todayWeekday} ${todayNum} ${todayMonth}`;
    const [selectedDay, setSelectedDay] = useState(defaultSelected);

    const [isAddGroupLessonVisible, setIsAddGroupLessonVisible] = useState(false);
    const [isAddIndividualLessonVisible, setIsAddIndividualLessonVisible] = useState(false);

    const dateOptions = generateDateOptions(today);

    const normalizedSelected = selectedDay.replace(/,/g, '').trim().toLowerCase();
    const filteredLessons = lessons.filter(
        (lesson: Lesson) =>
            lesson.dayLabel.replace(/,/g, '').trim().toLowerCase() === normalizedSelected
    );

    const handleConfirm = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, {confirmed: true}, {merge: true});
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map((l) => (l.id === lesson.id ? {...l, confirmed: true} : l))
            );
            console.log('Lesson confirmed:', lesson.lesson);
        } catch (error) {
            console.error('Error confirming lesson:', error);
        }
    };

    const handleCancel = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, {confirmed: false}, {merge: true});
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map((l) => (l.id === lesson.id ? {...l, confirmed: false} : l))
            );
            console.log('Lesson cancelled:', lesson.lesson);
        } catch (error) {
            console.error('Error cancelling lesson:', error);
        }
    };

    const handleAddGroupLesson = () => {
        setIsAddGroupLessonVisible(true);
    };

    const closeAddGroupLesson = () => {
        setIsAddGroupLessonVisible(false);
    };

    const handleAddIndividualLesson = () => {
        setIsAddIndividualLessonVisible(true);
    };

    const closeAddIndividualLesson = () => {
        setIsAddIndividualLessonVisible(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Основной контент, растягиваем на весь экран */}
            <View style={{flex: 1}}>
                <ScheduleHeader
                    todayNum={todayNum}
                    todayMonth={todayMonth}
                    todayWeekday={todayWeekday}
                    onTodayPress={() => setSelectedDay(defaultSelected)}
                />
                <ScheduleDatePicker
                    dateOptions={dateOptions}
                    selectedDay={selectedDay}
                    onSelectDay={setSelectedDay}
                />
                <ScheduleTable
                    lessons={filteredLessons}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </View>

            {/* Только для администратора */}
            {role === 'administrator' && (
                <View style={styles.adminButtonsContainer}>
                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={handleAddGroupLesson}
                    >
                        <Text style={styles.buttonText}>Добавить Г/З</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={handleAddIndividualLesson}
                    >
                        <Text style={styles.buttonText}>Добавить И/З</Text>
                    </TouchableOpacity>
                </View>

            )}

            {/* Модалка «Добавить групповое занятие» */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddGroupLessonVisible}
                onRequestClose={closeAddGroupLesson}
            >
                {/* Внутри Modal отображаем саму форму */}
                <AddGroupLesson onClose={closeAddGroupLesson}/>
            </Modal>

            {/* Модалка «Добавить индивидуальное занятие» */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddIndividualLessonVisible}
                onRequestClose={closeAddIndividualLesson}
            >
                {/* Внутри Modal отображаем саму форму */}
                <AddIndividualLesson onClose={closeAddIndividualLesson}/>
            </Modal>

        </SafeAreaView>
    );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Outfit',
    },
    adminButtonsContainer: {
        padding: 16,
    },
    blueButton: {
        backgroundColor: '#2F80ED', // ваш оттенок синего
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10, // промежуток между кнопками
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});