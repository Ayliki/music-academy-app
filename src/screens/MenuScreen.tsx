import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';
import { useUserData } from '../hooks/useUserData';
import LoadingOverlay from '../components/LoadingOverlay';
import ProfileSummary from '../components/ProfileSummary';
import MenuItem from '../components/MenuItem';

interface MenuItemData {
    label: string;
    screen?: string;
    onPress?: () => void;
    icon: keyof typeof Ionicons.glyphMap;
}

const MenuScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation<NavigationProps>();
    const { userData, isLoading, error } = useUserData();

    if (isLoading || !userData) {
        return <LoadingOverlay visible={true} />;
    }

    const fullName = `${userData.lastName} ${userData.firstName}`;

    const menuItems: MenuItemData[] = [
        { label: 'Профиль', screen: 'Profile', icon: 'person' },
        { label: 'События', screen: 'Events', icon: 'calendar' },
        { label: 'Расписание', screen: 'Schedule', icon: 'time' },
        { label: 'Подать заявку на И/З', screen: 'Application', icon: 'document-text' },
        { label: 'Педагоги', screen: 'Teachers', icon: 'people' },
        { label: 'Выйти', onPress: () => navigation.navigate('Login'), icon: 'log-out' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header*/}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Профиль</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            {/* Profile summary */}
            <ProfileSummary profile={userData} onPress={() => navigation.navigate('Profile')} />

            {/* Menu Items */}
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

export default MenuScreen;

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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
    },
    backButton: {
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 24,
        lineHeight: 30.24,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
    },
    headerRightPlaceholder: {
        width: 32,
    },
});