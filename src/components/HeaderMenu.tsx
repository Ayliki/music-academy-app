import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    title: string;
    onBack: () => void;
}

const HeaderMenu: React.FC<HeaderProps> = ({ title, onBack }) => {
    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={styles.placeholder} />
        </View>
    );
};

export default HeaderMenu;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    backButton: {
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 35,
    },
});
