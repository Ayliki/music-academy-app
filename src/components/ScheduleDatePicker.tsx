import React from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

type ScheduleDatePickerProps = {
    dateOptions: string[];
    selectedDay: string;
    onSelectDay: (day: string) => void;
};

const ScheduleDatePicker: React.FC<ScheduleDatePickerProps> = ({ dateOptions, selectedDay, onSelectDay }) => {

    return (
        <View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {dateOptions.map((item, index) => {
                    const isSelected = selectedDay === item;
                    const [weekday, dayNumber] = item.split(" ");
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                            onPress={() => onSelectDay(item)}
                        >
                            <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                {weekday}
                            </Text>
                            <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                {dayNumber}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>

    );
};

export default ScheduleDatePicker;

const styles = StyleSheet.create({
    scrollView: {
        height: 53,
    },
    scrollViewContent: {
        height: 53,
        alignItems: 'center',
    },
    dateButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#eee',
        borderRadius: 15,
        marginRight: 8,
        alignItems: 'center',
        flexDirection: 'column',
    },
    dateButtonSelected: {
        backgroundColor: '#F4B2B2',
    },
    dateText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#969696',
    },
    dateTextSelected: {
        color: '#fff',
    },
});

