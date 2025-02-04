import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <Ionicons name={icon} size={24} color="#000" style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        elevation: 1,
        borderWidth: 3,
        borderColor: '#EEEEEE',
    },
    menuIcon: {
        marginRight: 14,
    },
    menuLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#565454',
    },
});
