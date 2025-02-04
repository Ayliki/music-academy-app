import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MultiSelectDropdownProps {
    options: string[];
    selectedOptions: string[];
    onSelectionChange: (newSelection: string[]) => void;
    placeholder?: string;
    label?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
    options,
    selectedOptions,
    onSelectionChange,
    placeholder = 'Выберите',
    label,
}) => {
    const [open, setOpen] = useState(false);

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            onSelectionChange(selectedOptions.filter(o => o !== option));
        } else {
            onSelectionChange([...selectedOptions, option]);
        }
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setOpen(!open)}
            >
                <Text style={styles.dropdownText}>
                    {selectedOptions.length > 0 ? selectedOptions.join(', ') : placeholder}
                </Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#00A9E3"
                    style={styles.dropdownIcon}
                />
            </TouchableOpacity>
            {open && (
                <View style={styles.optionsContainer}>
                    {options.map((option, index) => {
                        const selected = selectedOptions.includes(option);
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggleOption(option)}
                                style={[styles.option, selected && styles.optionSelected]}
                            >
                                <Text style={styles.optionText}>{option}</Text>
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

export default MultiSelectDropdown;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontFamily: 'Outfit',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#00A9E3',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#00A9E3',
        borderRadius: 8,
    },
    option: {
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#ccc',
        borderRadius: 8,
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
