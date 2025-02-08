import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export type Lesson = {
    id: string;
    timeStart: string;
    timeEnd: string;
    lesson: string;
    room: string;
    instructor: string;
    bgColor: string;
    confirmed?: boolean;
    actions?: boolean;
    dayLabel: string;
};

type ScheduleTableProps = {
    lessons: Lesson[];
    onConfirm: (lesson: Lesson) => void;
    onCancel: (lesson: Lesson) => void;
};

const ScheduleTable: React.FC<ScheduleTableProps> = ({ lessons, onConfirm, onCancel }) => {
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
                    {lessons.map((lesson, index) => (
                        <View key={index} style={[styles.lessonCard, { backgroundColor: lesson.bgColor }]}>
                            <Text style={styles.lessonName}>{lesson.lesson}</Text>
                            <Text style={styles.roomText}>{lesson.room}</Text>
                            <Text style={styles.instructorText}>{lesson.instructor}</Text>
                            {lesson.confirmed === undefined && lesson.actions && (
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
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default ScheduleTable;

const styles = StyleSheet.create({
    scheduleContainer: {
        flex: 1,
        paddingHorizontal: 16,
        marginBottom: 32,
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
