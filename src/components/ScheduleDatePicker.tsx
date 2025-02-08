import React, { useRef } from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet, FlatList } from "react-native";

type ScheduleDatePickerProps = {
    dateOptions: string[];
    selectedDay: string;
    onSelectDay: (day: string) => void;
};

const ScheduleDatePicker: React.FC<ScheduleDatePickerProps> = ({ dateOptions, selectedDay, onSelectDay }) => {
    return (
        <FlatList
            data={dateOptions}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datePickerContainer}
            renderItem={({ item }) => {
                const isSelected = selectedDay === item;
                const parts = item.split(" ");
                const weekday = parts[0];
                const dayNumber = parts[1];

                return (
                    <TouchableOpacity
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
            }}
            style={styles.flatList}
        />


    );
};

export default ScheduleDatePicker;

const styles = StyleSheet.create({
    flatList: {
        height: 53,
    },
    datePickerContainer: {
        paddingHorizontal: 16,
        height: 53,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 8,
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

