import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from '../styles/ScheduleTableStyles';
import {collection, getDocs} from 'firebase/firestore';
import {db} from '../services/firebaseConfig';
import {useAuth} from '../context/AuthContext';
import {IndividualLessonStatus} from "../types/IndividualLessonStatus";

export type Lesson = {
    id: string;
    lessonId: string;
    groupId?: string;       // Если занятие групповое, это поле заполнено
    studentId?: string;     // Если занятие индивидуальное, это поле заполнено
    roomId: string;
    subjectId: string;
    teacherId: string;
    timeStart: string;
    timeEnd: string;
    confirmed?: boolean;
    actions?: boolean;
    date: string;
    status: IndividualLessonStatus;
};

type ScheduleTableProps = {
    lessons: Lesson[];
    onConfirm: (lesson: Lesson) => void;
    onCancel: (lesson: Lesson) => void;
    onStudentPaid: (lesson: Lesson) => void; // Добавлен новый пропс для админа
};

type RoomMapping = {
    name: string;
    color: string;
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({lessons, onConfirm, onCancel, onStudentPaid}) => {
    // Словари для сопоставления ID с именами
    const [subjectsMap, setSubjectsMap] = useState<{ [key: string]: string }>({});
    const [roomsMap, setRoomsMap] = useState<{ [key: string]: RoomMapping }>({});
    const [teachersMap, setTeachersMap] = useState<{ [key: string]: string }>({});
    const [groupsMap, setGroupsMap] = useState<{ [key: string]: string }>({});
    const [studentsMap, setStudentsMap] = useState<{ [key: string]: string }>({});

    const {role} = useAuth();

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

                // Получение кабинетов (имя и цвет)
                const roomsSnapshot = await getDocs(collection(db, 'rooms'));
                const rooms: { [key: string]: RoomMapping } = {};
                roomsSnapshot.forEach(doc => {
                    const data = doc.data();
                    rooms[doc.id] = {name: data.name, color: data.color};
                });
                setRoomsMap(rooms);

                // Получение преподавателей (из коллекции "users")
                const teachersSnapshot = await getDocs(collection(db, 'users'));
                const teachers: { [key: string]: string } = {};
                teachersSnapshot.forEach(doc => {
                    const data = doc.data();
                    teachers[doc.id] = `${data.lastName || ''} ${data.firstName || ''} ${data.middleName || ''}`.trim();
                });
                setTeachersMap(teachers);

                // Получение групп
                const groupsSnapshot = await getDocs(collection(db, 'groups'));
                const groups: { [key: string]: string } = {};
                groupsSnapshot.forEach(doc => {
                    const data = doc.data();
                    groups[doc.id] = data.name;
                });
                setGroupsMap(groups);

                // Получение учеников
                const studentsSnapshot = await getDocs(collection(db, 'students'));
                const students: { [key: string]: string } = {};
                studentsSnapshot.forEach(doc => {
                    const data = doc.data();
                    students[doc.id] = `${data.lastName || ''} ${data.firstName || ''}`.trim();
                });
                setStudentsMap(students);
            } catch (error) {
                console.error("Error fetching mappings: ", error);
            }
        };

        fetchMappings();
    }, []);

    // Функция для преобразования строки времени HH:MM в число (минуты)
    const parseTimeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Сортируем занятия по времени старта
    const sortedLessons = [...lessons].sort(
        (a, b) => parseTimeToMinutes(a.timeStart) - parseTimeToMinutes(b.timeStart)
    );

    return (
        <ScrollView style={styles.scheduleContainer}>
            <View style={styles.scheduleTable}>
                <View style={styles.leftColumn}>
                    <Text style={styles.columnHeader}>Время</Text>
                    {sortedLessons.map((lesson, index) => (
                        <View key={index} style={styles.timeRow}>
                            <Text style={styles.startTime}>{lesson.timeStart}</Text>
                            <Text style={styles.endTime}>{lesson.timeEnd}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.columnHeader}>Занятие</Text>
                    {sortedLessons.map((lesson, index) => {
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

                                {/* Отображаем информацию о группе, если groupId заполнено */}
                                {lesson.groupId && (
                                    <Text style={styles.groupText}>
                                        Группа: {groupsMap[lesson.groupId] || lesson.groupId}
                                    </Text>
                                )}

                                {/* Отображаем информацию об ученике, если studentId заполнено */}
                                {lesson.studentId && (
                                    <Text style={styles.studentText}>
                                        Ученик: {studentsMap[lesson.studentId] || lesson.studentId}
                                    </Text>
                                )}

                                {/* Отображаем кнопки "Подтвердить" и "Отклонить" для ученика */}
                                {role === "default" && lesson.status === IndividualLessonStatus.WaitForConfirmation && (
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

                                {/* Отображаем статус "Подтверждено" */}
                                {lesson.status === IndividualLessonStatus.Confirmed && (
                                    <Text style={styles.statusPositive}>Подтверждено</Text>
                                )}

                                {/* Отображаем статус "Отменено" */}
                                {lesson.status === IndividualLessonStatus.Canceled && (
                                    <Text style={styles.statusNegative}>Отменено</Text>
                                )}

                                {/* Отображаем статус "Отменено, но нуждается в оплате" */}
                                {lesson.status === IndividualLessonStatus.CanceledNeedsPayment && (
                                    <Text style={styles.statusNegative}>Отменено, но нуждается в оплате</Text>
                                )}

                                {/* Отображаем кнопку "Оплатить" для админа */}
                                {role == "administrator" && lesson.status == IndividualLessonStatus.CanceledNeedsPayment && (
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity
                                            style={styles.confirmButton}
                                            onPress={() => onStudentPaid(lesson)}
                                        >
                                            <Text style={styles.actionButtonText}>Ученик оплатил</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Отображаем статус "Отменено, но оплачено" */}
                                {lesson.status === IndividualLessonStatus.CanceledPaid && (
                                    <Text style={styles.statusNegative}>Отменено, но оплачено</Text>
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