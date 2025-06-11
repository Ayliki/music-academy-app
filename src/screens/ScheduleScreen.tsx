import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {doc, setDoc, updateDoc, deleteDoc} from 'firebase/firestore';
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
import EditLessonModal from "../components/admin/EditLessonModal";
import {IndividualLessonStatus} from "../types/IndividualLessonStatus";

interface DateOption {
    iso: string;
    display: string;
}

const generateDateOptions = (baseDate: Date, rangeBefore: number, rangeAfter: number): DateOption[] => {
    const options: DateOption[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    for (let i = -rangeBefore; i <= rangeAfter; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);

        // Skip dates earlier than today
        if (d < today) continue;

        const iso = d.toISOString().split('T')[0]; // формат ГГГГ-ММ-ДД
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
    const {dbUser, role} = useAuth();
    const [isAddGroupLessonModalVisible, setIsAddGroupLessonModalVisible] = useState(false);
    const [isAddIndividualLessonModalVisible, setIsAddIndividualLessonModalVisible] = useState(false);
    const [isEditLessonModalVisible, setIsEditLessonModalVisible] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    // anchorDate определяет, относительно какой даты генерируются опции
    const [anchorDate, setAnchorDate] = useState(today);
    // Выбранная дата (по умолчанию – сегодня)
    const [selectedDateIso, setSelectedDateIso] = useState(todayIso);

    // Генерируем опции относительно anchorDate (10 дней до и 10 дней после)
    const dateOptions = generateDateOptions(anchorDate, 10, 10);

    const selectedDate = new Date(selectedDateIso);
    // Фильтруем уроки по выбранной дате
    const filteredLessons = lessons.filter((lesson: Lesson) => {
        if (lesson.date !== selectedDateIso) return false;

        if (role === 'administrator') {
            return true;
        }
        if (role === 'teacher' && dbUser) {
            return lesson.teacherId === dbUser.email;
        }
        if (role === "default" && dbUser) {
            return lesson.groupId === dbUser.groupId || lesson.studentId === dbUser.email;
        }
        return false;
    });

    const handleConfirmByStudent = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);

            await setDoc(lessonRef, {status: IndividualLessonStatus.Confirmed.toString()}, {merge: true});
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map(l => (l.id === lesson.id ? {...l, confirmed: true} : l))
            );
            Alert.alert("Занятие успешно подтверждено!");
            console.log('Lesson confirmed:', lesson.id);
        } catch (error) {
            console.error('Error confirming lesson:', error);
        }
    };

    const handleCancelByStudent = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            const now = new Date();

            const lessonStart = new Date(`${lesson.date}T${lesson.timeStart}:00`);
            const timeDifference = lessonStart.getTime() - now.getTime();
            const sixHours = 24 * 60 * 60 * 1000; // 6 часов в миллисекундах

            if (timeDifference < sixHours) {
                await setDoc(lessonRef, {status: IndividualLessonStatus.CanceledNeedsPayment.toString()}, {merge: true});
                setLessons((prevLessons: Lesson[]) =>
                    prevLessons.map(l =>
                        l.id === lesson.id
                            ? {...l, status: IndividualLessonStatus.CanceledNeedsPayment}
                            : l
                    )
                );
                Alert.alert('Занятие отменено, но нуждается в оплате, так как отмена произошла слишком поздно');
                console.log('Lesson cancelled without payment:', lesson.id);
            } else {
                await setDoc(lessonRef, {status: IndividualLessonStatus.Canceled.toString()}, {merge: true});
                setLessons((prevLessons: Lesson[]) =>
                    prevLessons.map(l =>
                        l.id === lesson.id
                            ? {...l, status: IndividualLessonStatus.Canceled}
                            : l
                    )
                );
                Alert.alert("Занятие успешно отменено!");
                console.log('Lesson cancelled:', lesson.id);
            }
        } catch (error) {
            console.error('Error cancelling lesson:', error);
        }
    };

    const markLessonAsPaid = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await updateDoc(lessonRef, {status: IndividualLessonStatus.CanceledPaid.toString()});
            console.log(`Урок ${lesson.lessonId} переведен в статус "Отменено, но оплачено"`);
        } catch (error) {
            console.error("Ошибка при обновлении статуса урока: ", error);
        }
    };

    const handleEditLesson = (lesson: Lesson) => {
        setSelectedLesson(lesson);
        setIsEditLessonModalVisible(true);
    };

    const handleDeleteLesson = (lesson: Lesson) => {
        Alert.alert(
            "Вы точно хотите удалить занятие?",
            "Это действие нельзя будет отменить.",
            [
                { text: "Отмена", style: "cancel" },
                {
                    text: "Удалить",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'lessons', lesson.id));
                            // Обновляем список занятий после удаления
                            setLessons(prevLessons => prevLessons.filter(l => l.id !== lesson.id));
                            Alert.alert("Успех", "Занятие успешно удалено");
                        } catch (error: any) {
                            console.error('Ошибка при удалении занятия:', error);
                            Alert.alert('Ошибка', 'Не удалось удалить занятие');
                        }
                    },
                    style: "destructive",
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={{flex: 1}}>
                <ScheduleHeader
                    selectedDate={selectedDate}
                    onTodayPress={() => {
                        setSelectedDateIso(todayIso);
                        setAnchorDate(today);
                    }}
                />
                <ScheduleDatePicker
                    // Передаём отформатированные строки дат
                    dateOptions={dateOptions.map(option => option.display)}
                    // Отмечаем выбранный день по его отображаемой строке
                    selectedDay={
                        dateOptions.find(option => option.iso === selectedDateIso)?.display || ''
                    }
                    onSelectDay={(selectedDisplay: string) => {
                        const option = dateOptions.find(o => o.display === selectedDisplay);
                        if (option) {
                            setSelectedDateIso(option.iso);
                            // При выборе даты обновляем anchorDate, чтобы генерировать новые опции
                            setAnchorDate(new Date(option.iso));
                        }
                    }}
                    // Передаём индекс, на который нужно прокрутить (выбранная дата всегда в центре)
                    initialIndex={-15}
                />
                <ScheduleTable
                    lessons={filteredLessons}
                    onConfirm={handleConfirmByStudent}
                    onCancel={handleCancelByStudent}
                    onStudentPaid={markLessonAsPaid}
                    onEdit={handleEditLesson}
                    onDelete={handleDeleteLesson}
                />
            </View>

            {role === 'administrator' && selectedDateIso >= todayIso && (
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

            {role === 'administrator' && selectedDateIso >= todayIso && (
                <AddGroupLessonModal
                    visible={isAddGroupLessonModalVisible}
                    onClose={() => setIsAddGroupLessonModalVisible(false)}
                    date={new Date(selectedDateIso)}
                />
            )}

            {role === 'administrator' && selectedDateIso >= todayIso && (
                <AddIndividualLessonModal
                    visible={isAddIndividualLessonModalVisible}
                    onClose={() => setIsAddIndividualLessonModalVisible(false)}
                    date={new Date(selectedDateIso)}
                />
            )}

            {role === 'administrator' && (
                <EditLessonModal
                    lesson={selectedLesson}
                    visible={isEditLessonModalVisible}
                    onClose={() => setIsEditLessonModalVisible(false)}
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
