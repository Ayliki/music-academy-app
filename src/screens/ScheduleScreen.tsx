import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
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
import AddGroupLessonModal from "../components/admin/AddGroupLessonModal";
import AddIndividualLessonModal from "../components/admin/AddIndividualLessonModal";

interface DateOption {
    iso: string;
    display: string;
}

const generateDateOptions = (baseDate: Date): DateOption[] => {
    const options: DateOption[] = [];
    for (let i = 0; i < 20; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        const iso = d.toISOString().split('T')[0]; // ГГГГ-ММ-ДД
        const display = d
            .toLocaleDateString('ru-RU', {weekday: 'short', day: 'numeric', month: 'long'})
            .replace(/[.,]/g, '')
            .trim();
        options.push({iso, display});
    }
    return options;
};

const ScheduleScreen: React.FC = () => {
    const {lessons, setLessons} = useLessons();
    const navigation = useNavigation<NavigationProps>();
    const {role} = useAuth();
    const [isAddGroupLessonModalVisible, setIsAddGroupLessonModalVisible] = useState(false);
    const [isAddIndividualLessonModalVisible, setIsAddIndividualLessonModalVisible] = useState(false);

    const today = new Date();
    const dateOptions = generateDateOptions(today);

    // Храним выбранную дату в формате ISO (ГГГГ-ММ-ДД)
    const [selectedDateIso, setSelectedDateIso] = useState(dateOptions[0].iso);

    const selectedDate = new Date(selectedDateIso);

    // Фильтруем уроки по полю date (предполагается, что на бэкенде дата хранится в формате ГГГГ-ММ-ДД)
    const filteredLessons = lessons.filter((lesson: Lesson) => lesson.date === selectedDateIso);

    const handleConfirm = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, {confirmed: true}, {merge: true});
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map((l) => (l.id === lesson.id ? {...l, confirmed: true} : l))
            );
            console.log('Lesson confirmed:', lesson.id);
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
            console.log('Lesson cancelled:', lesson.id);
        } catch (error) {
            console.error('Error cancelling lesson:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{flex: 1}}>
                <ScheduleHeader
                    selectedDate={selectedDate}
                    onTodayPress={() => setSelectedDateIso(dateOptions[0].iso)}
                />
                <ScheduleDatePicker
                    // Передаём массив отображаемых строк для выбора даты
                    dateOptions={dateOptions.map(option => option.display)}
                    selectedDay={
                        dateOptions.find(option => option.iso === selectedDateIso)?.display || ''
                    }
                    onSelectDay={(selectedDisplay: string) => {
                        const option = dateOptions.find(o => o.display === selectedDisplay);
                        if (option) {
                            setSelectedDateIso(option.iso);
                        }
                    }}
                />
                <ScheduleTable
                    lessons={filteredLessons}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </View>

            {role === 'administrator' && (
                <View style={styles.adminButtonsContainer}>
                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={() => setIsAddGroupLessonModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Добавить Г/З</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.blueButton}
                        onPress={() => setIsAddIndividualLessonModalVisible(true)}
                    >
                        <Text style={styles.buttonText}>Добавить И/З</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Передаём в модальные окна выбранную дату, преобразованную в объект Date */}
            {role === 'administrator' && (
                <AddGroupLessonModal
                    visible={isAddGroupLessonModalVisible}
                    onClose={() => setIsAddGroupLessonModalVisible(false)}
                    date={new Date(selectedDateIso)}
                />
            )}

            {role === 'administrator' && (
                <AddIndividualLessonModal
                    visible={isAddIndividualLessonModalVisible}
                    onClose={() => setIsAddIndividualLessonModalVisible(false)}
                    date={new Date(selectedDateIso)}
                />
            )}
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
        backgroundColor: '#2F80ED',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});