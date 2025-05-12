import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "src/context/AuthContext";
import {NavigationProps} from "src/navigation/types";

type ScheduleHeaderProps = {
    selectedDate: Date;
    onTodayPress: () => void;
};

const ScheduleHeader: React.FC<ScheduleHeaderProps> = (
    {
        selectedDate,
        onTodayPress,
    }) => {
    const navigation = useNavigation<NavigationProps>();
    const {role} = useAuth();

    const handleBack = () => {
        navigation.goBack();
    };

    const todayNum = selectedDate.getDate();
    const todayMonth = selectedDate.toLocaleDateString('ru-RU', {month: 'short'})
        .replace(/[.,]/g, '')
        .trim()
    const todayWeekday = selectedDate.toLocaleDateString('ru-RU', {weekday: 'short'})
        .replace(/[.,]/g, '')
        .trim()

    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={(handleBack)}>
                <Ionicons name="chevron-back" size={32} color="#000"/>
            </TouchableOpacity>
            <View style={styles.dateInfoContainer}>
                <View style={styles.dateTextContainer}>
                    <Text style={styles.dateTextDay}>{todayNum}</Text>
                    <Text style={styles.dateTextMonth}>{todayMonth}</Text>
                </View>
                <View style={styles.dateTextContainer}>
                    <Text style={styles.dayText}>{todayWeekday}</Text>
                    <Text style={styles.yearText}>2025 год</Text>
                </View>
                <TouchableOpacity style={styles.todayButton} onPress={onTodayPress}>
                    <Text style={styles.todayButtonText}>Сегодня</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ScheduleHeader;

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 6,
    },
    backButton: {
        marginRight: 16,
    },
    dateInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginTop: 16,
    },
    dateTextContainer: {
        flexDirection: 'column',
        marginRight: 8,
    },
    dateTextDay: {
        fontSize: 30,
        fontWeight: '600',
        color: '#000',
    },
    dateTextMonth: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
    },
    dayText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#969696',
    },
    yearText: {
        fontSize: 25,
        fontWeight: '600',
        color: '#000',
    },
    groupLabel: {
        fontFamily: 'Outfit',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
        color: '#000',
        marginVertical: 6,
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
});
