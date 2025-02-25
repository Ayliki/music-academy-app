import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from "react-native";
import styles from '../styles/ScheduleTableStyles';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../services/firebaseConfig';

export type Lesson = {
    id: string;
    lessonId: string;
    groupId: string;
    roomId: string;
    subjectId: string;
    teacherId: string;
    timeStart: string;
    timeEnd: string;
    confirmed?: boolean;
    actions?: boolean;
    date: string;
};

type ScheduleTableProps = {
    lessons: Lesson[];
    onConfirm: (lesson: Lesson) => void;
    onCancel: (lesson: Lesson) => void;
};

type RoomMapping = {
    name: string;
    color: string;
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({lessons, onConfirm, onCancel}) => {
    // Словари для сопоставления ID с именами
    const [subjectsMap, setSubjectsMap] = useState<{ [key: string]: string }>({});
    // Теперь roomsMap хранит объект с именем и цветом
    const [roomsMap, setRoomsMap] = useState<{ [key: string]: RoomMapping }>({});
    const [teachersMap, setTeachersMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchMappings = async () => {
            try {
                // Получение предметов
                const subjectsSnapshot = await getDocs(collection(db, 'subjects'));
                const subjects: { [key: string]: string } = {};
                subjectsSnapshot.forEach(doc => {
                    const data = doc.data();
                    subjects[doc.id] = data.name;
                });
                setSubjectsMap(subjects);

                // Получение кабинетов: сохраняем и имя, и цвет (room.color)
                const roomsSnapshot = await getDocs(collection(db, 'rooms'));
                const rooms: { [key: string]: RoomMapping } = {};
                roomsSnapshot.forEach(doc => {
                    const data = doc.data();
                    // Предполагается, что в документе есть поля name и color
                    rooms[doc.id] = {name: data.name, color: data.color};
                });
                setRoomsMap(rooms);

                // Получение преподавателей (из коллекции "users")
                const teachersSnapshot = await getDocs(collection(db, 'users'));
                const teachers: { [key: string]: string } = {};
                teachersSnapshot.forEach(doc => {
                    const data = doc.data();
                    // Формируем полное имя преподавателя (например, "Иванов Иван")
                    teachers[doc.id] = `${data.lastName || ''} ${data.firstName || ''} ${data.middleName || ''}`.trim();
                });
                setTeachersMap(teachers);
            } catch (error) {
                console.error("Error fetching mappings: ", error);
            }
        };

        fetchMappings();
    }, []);

    return (
        <ScrollView style={styles.scheduleContainer}>
            <View style={styles.scheduleTable}>
                <View style={styles.leftColumn}>
                    <Text style={styles.columnHeader}>Время</Text>
                    {lessons.map((lesson, index) => (
                        <View key={index} style={styles.timeRow}>
                            <Text style={styles.startTime}>{lesson.timeStart}</Text>
                            <Text style={styles.endTime}>{lesson.timeEnd}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.columnHeader}>Занятие</Text>
                    {lessons.map((lesson, index) => {
                        // Получаем название предмета
                        const subjectName = subjectsMap[lesson.subjectId] || lesson.subjectId;
                        // Получаем информацию о кабинете: имя и цвет
                        const roomData = roomsMap[lesson.roomId];
                        const roomName = roomData ? roomData.name : lesson.roomId;
                        const roomColor = roomData ? roomData.color : 'gray';
                        // Получаем имя преподавателя
                        const teacherName = teachersMap[lesson.teacherId] || lesson.teacherId;

                        return (
                            <View key={index} style={[styles.lessonCard, {backgroundColor: roomColor}]}>
                                <Text style={styles.lessonName}>{subjectName}</Text>
                                <Text style={styles.roomText}>Каб: {roomName}</Text>
                                <Text style={styles.instructorText}>Преподаватель: {teacherName}</Text>
                                {lesson.actions && lesson.confirmed === undefined && (
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                            style={styles.confirmButton}
                                            onPress={() => onConfirm(lesson)}
                                        >
                                            <Text style={styles.actionButtonText}>Подтвердить</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => onCancel(lesson)}
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
                        );
                    })}
                </View>
            </View>
        </ScrollView>
    );
};

export default ScheduleTable;