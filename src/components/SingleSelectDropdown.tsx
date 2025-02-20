import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SelectableItem} from "../types/SelectableItem";


interface SingleSelectDropdownProps {
    options: SelectableItem[];
    selectedOption: string; // Хранит ID выбранного элемента
    onSelectionChange: (newSelection: string) => void;
    placeholder?: string;
    label?: string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = (
    {
        options,
        selectedOption,
        onSelectionChange,
        placeholder = 'Выберите',
        label,
    }) => {
    const [open, setOpen] = useState(false);

    // Получаем название (name) по ID
    const selectedOptionName = options.find(option => option.id === selectedOption)?.name || placeholder;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setOpen(!open)}
            >
                <Text style={styles.dropdownText}>{selectedOptionName}</Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#00A9E3"
                    style={styles.dropdownIcon}
                />
            </TouchableOpacity>
            {open && (
                <View style={styles.optionsContainer}>
                    {options.map((option) => {
                        const selected = option.id === selectedOption;
                        return (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => {
                                    onSelectionChange(option.id);
                                    setOpen(false);
                                }}
                                style={[styles.option, selected && styles.optionSelected]}
                            >
                                <Text style={styles.optionText}>{option.name}</Text>
                                {selected && (
                                    <Ionicons
                                        name="checkmark"
                                        size={20}
                                        color="#fff"
                                        style={styles.optionCheckIcon}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default SingleSelectDropdown;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
        fontFamily: 'Outfit',
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    dropdown: {
        width: 328,
        height: 52,
        borderWidth: 2,
        borderColor: '#FFB400',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginBottom: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    dropdownIcon: {
        marginLeft: 8,
    },
    optionsContainer: {
        width: 328,
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#FFB400',
        borderRadius: 8,
        marginBottom: 16,
    },
    option: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    optionCheckIcon: {
        marginLeft: 'auto',
    },
});