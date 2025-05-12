import React, { useRef, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

type ScheduleDatePickerProps = {
    dateOptions: string[];
    selectedDay: string;
    onSelectDay: (day: string) => void;
    initialIndex: number;
};

const ITEM_WIDTH = 70;

const ScheduleDatePicker: React.FC<ScheduleDatePickerProps> = (
    {
        dateOptions,
        selectedDay,
        onSelectDay,
        initialIndex,
    }) => {
    const scrollViewRef = useRef<ScrollView>(null);

    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const index = dateOptions.findIndex(item => item === selectedDay);
        if (scrollViewRef.current && index !== -1 && containerWidth > 0) {
            // Вычисляем смещение так, чтобы выбранный элемент оказался по центру:
            const offsetX = index * ITEM_WIDTH - containerWidth / 2 + ITEM_WIDTH / 2;
            scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
        }
    }, [selectedDay, dateOptions, containerWidth]);


    return (
        <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
            >
                {dateOptions.map((item, index) => {
                    const isSelected = selectedDay === item;
                    const [weekday, dayNumber] = item.split(' ');
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
        height: 80,
        padding: 10
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

