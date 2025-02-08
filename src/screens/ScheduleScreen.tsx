// src/screens/ScheduleScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import { useLessons } from '../hooks/useLessons';
import ScheduleHeader from '../components/ScheduleHeader';
import ScheduleDatePicker from '../components/ScheduleDatePicker';
import ScheduleTable, { Lesson } from '../components/ScheduleTable';
import { db } from '../services/firebaseConfig';

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
    const { lessons, setLessons } = useLessons();
    const navigation = useNavigation<NavigationProps>();

    const today = new Date();
    const todayNum = today.getDate();
    const todayMonth = today
        .toLocaleDateString('ru-RU', { month: 'short' })
        .replace(/[.,]/g, '')
        .trim();
    const todayWeekday = today
        .toLocaleDateString('ru-RU', { weekday: 'short' })
        .replace(/[.,]/g, '')
        .trim();
    const defaultSelected = `${todayWeekday} ${todayNum} ${todayMonth}`;
    const [selectedDay, setSelectedDay] = useState(defaultSelected);

    const dateOptions = generateDateOptions(today);

    const normalizedSelected = selectedDay.replace(/,/g, '').trim().toLowerCase();
    const filteredLessons = lessons.filter((lesson: Lesson) =>
        lesson.dayLabel.replace(/,/g, '').trim().toLowerCase() === normalizedSelected
    );

    const handleConfirm = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, { confirmed: true }, { merge: true });
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map(l => (l.id === lesson.id ? { ...l, confirmed: true } : l))
            );
            console.log('Lesson confirmed:', lesson.lesson);
        } catch (error) {
            console.error('Error confirming lesson:', error);
        }
    };

    const handleCancel = async (lesson: Lesson) => {
        try {
            const lessonRef = doc(db, 'lessons', lesson.id);
            await setDoc(lessonRef, { confirmed: false }, { merge: true });
            setLessons((prevLessons: Lesson[]) =>
                prevLessons.map(l => (l.id === lesson.id ? { ...l, confirmed: false } : l))
            );
            console.log('Lesson cancelled:', lesson.lesson);
        } catch (error) {
            console.error('Error cancelling lesson:', error);
        }
    };

    const handleBack = () => {
        navigation.navigate('Menu');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScheduleHeader
                todayNum={todayNum}
                todayMonth={todayMonth}
                todayWeekday={todayWeekday}
                onBack={handleBack}
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
});
