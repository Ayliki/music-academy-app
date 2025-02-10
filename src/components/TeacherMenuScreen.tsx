// TeacherMenuScreen.tsx
import React from 'react';
import { SafeAreaView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import HeaderMenu from '../components/HeaderMenu';
import MenuItem from '../components/MenuItem';

interface TeacherMenuItemData {
    label: string;
    screen?: string;
    onPress?: () => void;
    icon: keyof typeof Ionicons.glyphMap;
}

const TeacherMenuScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<NavigationProps>();

    const menuItems: TeacherMenuItemData[] = [
        { label: 'Профиль', screen: 'TeacherProfile', icon: 'person' },
        { label: 'События', screen: 'Events', icon: 'calendar' },
        { label: 'Расписание', screen: 'TeacherSchedule', icon: 'time' },
        { label: 'Выйти', onPress: () => navigation.navigate('Login'), icon: 'log-out' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderMenu title="Профиль" onBack={() => navigation.goBack()} />
            <View style={[styles.menuItemsContainer, { paddingHorizontal: width * 0.05 }]}>
                {menuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        label={item.label}
                        icon={item.icon}
                        onPress={() =>
                            item.onPress ? item.onPress() : navigation.navigate(item.screen as any)
                        }
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

export default TeacherMenuScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    menuItemsContainer: {
        paddingBottom: 32,
        width: '100%',
        alignSelf: 'center',
    },
});
