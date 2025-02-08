import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';

const useLessons = (): { lessons: any[]; setLessons: React.Dispatch<React.SetStateAction<any[]>> } => {
    const [lessons, setLessons] = useState<any[]>([]);

    useEffect(() => {
        const lessonsCol = collection(db, 'lessons');
        const unsubscribe = onSnapshot(lessonsCol, (snapshot) => {
            const lessonsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLessons(lessonsData);
        });
        return () => unsubscribe();
    }, []);

    return { lessons, setLessons };
};

const generateDateOptions = (baseDate: Date): string[] => {
    const options: string[] = [];
    for (let i = 0; i < 20; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        const weekday = d
            .toLocaleDateString('ru-RU', { weekday: 'short' })
            .replace(/[.,]/g, '')
            .trim();
        const day = d.getDate();
        const month = d
            .toLocaleDateString('ru-RU', { month: 'short' })
            .replace(/[.,]/g, '')
            .trim();
        options.push(`${weekday} ${day} ${month}`);
    }
    return options;
};

const ScheduleScreen: React.FC = () => {
    const today = new Date();
    const todayNum = today.getDate();
    const todayMonth = today.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '');
    const todayWeekday = today.toLocaleDateString('ru-RU', { weekday: 'short' }).replace('.', '');
    const navigation = useNavigation<NavigationProps>();

    const defaultSelected = `${todayWeekday} ${todayNum}`;
    console.log("Default selected:", defaultSelected);
    const [selectedDay, setSelectedDay] = useState(defaultSelected);

    const dateOptions = generateDateOptions(today);

    const { lessons, setLessons } = useLessons();

    const normalizedSelected = selectedDay.replace(/,/g, '').trim().toLowerCase();
    const filteredLessons = lessons.filter((lesson) =>
        lesson.dayLabel.replace(/,/g, '').trim().toLowerCase() === normalizedSelected
    );



    const handleConfirm = async (lesson: any) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, { confirmed: true }, { merge: true });
            setLessons((prevLessons: any[]) =>
                prevLessons.map(l => (l.id === lesson.id ? { ...l, confirmed: true } : l))
            );
            console.log('Lesson confirmed:', lesson.lesson);
        } catch (error) {
            console.error('Error confirming lesson:', error);
        }
    };

    const handleCancel = async (lesson: any) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, { confirmed: false }, { merge: true });
            // Update local state immediately:
            setLessons((prevLessons: any[]) =>
                prevLessons.map(l => (l.id === lesson.id ? { ...l, confirmed: false } : l))
            );
            console.log('Lesson cancelled:', lesson.lesson);
        } catch (error) {
            console.error('Error cancelling lesson:', error);
        }
    };

    console.log("Filtered lessons:", filteredLessons);

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { navigation.navigate('Menu') }} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={32} color="#000" />
                </TouchableOpacity>
                {/* Date Info */}
                <View style={styles.dateInfoContainer}>
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dateTextDay}>{todayNum}</Text>
                        <Text style={styles.dateTextMonth}>{todayMonth}</Text>
                    </View>
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dayText}>{todayWeekday}</Text>
                        <Text style={styles.yearText}>2025 год</Text>
                        <Text style={styles.groupLabel}>Группа: Junior 2</Text>
                    </View>
                    <TouchableOpacity style={styles.todayButton} onPress={() => setSelectedDay(`${todayWeekday} ${todayNum}`)}>
                        <Text style={styles.todayButtonText}>Сегодня</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dateOptions.map((item, index) => {
                        const [dayAbbrev, dateNum] = item.split(' ');
                        const isSelected = selectedDay === item;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dateButton,
                                    selectedDay === item && styles.dateButtonSelected,
                                ]}
                                onPress={() => setSelectedDay(item)}
                            >
                                <Text style={[styles.dateDayText, isSelected && styles.dateDayTextSelected]}>
                                    {dayAbbrev}
                                </Text>
                                <Text style={[styles.dateNumberText, isSelected && styles.dateNumberTextSelected]}>
                                    {dateNum}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Schedule Table */}
            <ScrollView style={styles.scheduleContainer}>
                <View style={styles.scheduleTable}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.columnHeader}>Время</Text>
                        {filteredLessons.map((lesson, index) => (
                            <View key={index} style={styles.timeRow}>
                                <Text style={styles.startTime}>{lesson.timeStart}</Text>
                                <Text style={styles.endTime}>{lesson.timeEnd}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.rightColumn}>
                        <Text style={styles.columnHeader}>Занятие</Text>
                        {filteredLessons.map((lesson, index) => (
                            <View key={index} style={[styles.lessonCard, { backgroundColor: lesson.bgColor }]}>
                                <Text style={styles.lessonName}>{lesson.lesson}</Text>
                                <Text style={styles.roomText}>{lesson.room}</Text>
                                <Text style={styles.instructorText}>{lesson.instructor}</Text>
                                {lesson.confirmed === undefined && lesson.actions && (
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                            style={styles.confirmButton}
                                            onPress={() => handleConfirm(lesson)}
                                        >
                                            <Text style={styles.actionButtonText}>Подтвердить</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => handleCancel(lesson)}
                                        >
                                            <Text style={styles.actionButtonText}>Отменить</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {lesson.confirmed === true && (
                                    <Text style={styles.confirmedText}>Подтверждено</Text>
                                )}

                                {lesson.confirmed === false && (
                                    <Text style={styles.canceledText}>Отменено</Text>
                                )}

                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

        </SafeAreaView >
    );
};

export default ScheduleScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: "Outfit",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    backButton: {
        marginRight: 20,
        marginTop: -47,
        marginLeft: -15,
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        color: '#00A9E3',
        textAlign: 'center',
        fontWeight: '600',
    },
    headerRightPlaceholder: {
        width: 32,
    },
    dateInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginTop: 16,
    },
    dateTextContainer: {
        flexDirection: 'column',
    },
    dateTextDay: {
        fontSize: 30,
        fontWeight: '600',
        color: '#000',
        marginRight: 8,
    },
    dateTextMonth: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
        marginRight: 6,
    },
    dayText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#969696',
        marginRight: 6,
    },
    yearText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
    },
    groupLabel: {
        fontFamily: "Outfit",
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
        color: '#000',
        marginVertical: 6,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    dateButton: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: '#eee',
        minHeight: 50,
        borderRadius: 15,
        marginRight: 8,
        alignItems: 'center',
    },
    dateDayText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#969696',
    },
    dateNumberText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    dateButtonSelected: {
        backgroundColor: '#F4B2B2',
        borderRadius: 20,
    },
    dateDayTextSelected: {
        color: '#fff',
    },
    dateNumberTextSelected: {
        color: '#fff',
    },
    todayButton: {
        backgroundColor: '#E9F4EF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 15,
    },
    todayButtonText: {
        fontSize: 16,
        color: '#4DC591',
        fontWeight: '600',
    },
    scheduleTable: {
        flexDirection: 'row',
    },
    leftColumn: {
        width: 90,
        borderRightWidth: 2,
        borderRightColor: '#ccc',
    },
    rightColumn: {
        flex: 1,
        paddingLeft: 10,
    },
    columnHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 12,
    },
    timeRow: {
        marginBottom: 80,
        alignItems: 'flex-start',
    },
    startTime: {
        fontSize: 20,
        fontWeight: '600',
        color: '#66666',
    },
    endTime: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ABABAB',
    },
    verticalDivider: {
        width: 2,
        backgroundColor: '#EBEBEB',
        height: '100%',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666666',
    },
    scheduleContainer: {
        flex: 1,
        paddingHorizontal: 16,
        marginBottom: 32,
    },
    lessonRow: {
        flexDirection: 'row',
        marginBottom: 16,
        alignItems: 'center',

    },
    timeColumn: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    time: {
        fontSize: 20,
        fontWeight: '600',
        color: '#666666',
    },
    lessonCard: {
        flex: 1,
        borderRadius: 8,
        padding: 12,
        marginBottom: 25,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    lessonName: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    roomText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    instructorText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 8,
    },
    confirmButton: {
        backgroundColor: '#E2FBE3',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
        minWidth: 80,
    },
    cancelButton: {
        backgroundColor: '#E83D3D',
        paddingVertical: 5,
        paddingHorizontal: 5,
        borderRadius: 15,
        flex: 1,
        marginLeft: 8,
        alignItems: 'center',
        minWidth: 80,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    confirmedText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
    canceledText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 8,
    },
});

