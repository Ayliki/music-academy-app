import React, { useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const lessons = [
    {
        timeStart: '09:00',
        timeEnd: '09:45',
        lesson: 'Сольфеджио',
        room: 'Каб: желтый',
        instructor: 'Преп: Роза Лукмановна',
        bgColor: '#FFC600',
    },
    {
        timeStart: '10:00',
        timeEnd: '10:45',
        lesson: 'Актерское мастерство',
        room: 'Каб: оранжевый',
        instructor: 'Преп: Роза Лукмановна',
        bgColor: '#F9B658',
    },
    {
        timeStart: '11:00',
        timeEnd: '11:45',
        lesson: 'Вокал',
        room: 'Каб: розовый',
        instructor: 'Преп: Роза Лукмановна',
        bgColor: '#F4B2B2',
        actions: true,
    },
];

const dateOptions = ['Пн 27', 'Вт 28', 'Ср 29', 'Сб 30', 'Вс 31'];

const ScheduleScreen: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState('Сб 30');

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {/* Add back action */ }} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={32} color="#000" />
                </TouchableOpacity>
                {/* Date Info */}
                <View style={styles.dateInfoContainer}>
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dateTextDay}>30</Text>
                        <Text style={styles.dateTextMonth}>ноя</Text>
                    </View>
                    <View style={styles.dateTextContainer}>
                        <Text style={styles.dayText}>Сб</Text>
                        <Text style={styles.yearText}>2024 год</Text>
                        <Text style={styles.groupLabel}>Группа: Junior 2</Text>
                    </View>
                    <TouchableOpacity style={styles.todayButton} onPress={() => setSelectedDay('Сб 30')}>
                        <Text style={styles.todayButtonText}>Сегодня</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Date Picker */}
            <View style={styles.datePickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dateOptions.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dateButton,
                                selectedDay === item && styles.dateButtonSelected,
                            ]}
                            onPress={() => setSelectedDay(item)}
                        >
                            <Text style={styles.dateButtonText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Schedule Table */}
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
                                {lesson.actions && (
                                    <View style={styles.actionsContainer}>
                                        <TouchableOpacity style={styles.confirmButton}>
                                            <Text style={styles.actionButtonText}>Подтвердить</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cancelButton}>
                                            <Text style={styles.actionButtonText}>Отменить</Text>
                                        </TouchableOpacity>
                                    </View>
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
        marginRight: 22,
        marginTop: -47,
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
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#eee',
        borderRadius: 20,
        marginRight: 8,
    },
    dateButtonSelected: {
        backgroundColor: '#F4B2B2',
        borderRadius: 20,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#000',
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
        marginBottom: 16,
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
    },
    timeColumn: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 20,
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
        marginBottom: 16,
        justifyContent: 'center',

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
});

