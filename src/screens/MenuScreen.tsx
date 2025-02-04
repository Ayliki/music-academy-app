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
import ProfilePictureComponent from '../components/ProfilePicture';
import { NavigationProps } from '../navigation/types';
import { useUserData } from '../hooks/useUserData';
import LoadingOverlay from '../components/LoadingOverlay';

interface MenuItem {
    label: string;
    screen?: string;
    action?: () => void;
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

    const menuItems: MenuItem[] = [
        { label: 'Профиль', screen: 'Profile', icon: 'person' },
        { label: 'События', screen: 'Events', icon: 'calendar' },
        { label: 'Расписание', screen: 'Schedule', icon: 'time' },
        { label: 'Подать заявку на И/З', screen: 'Application', icon: 'document-text' },
        { label: 'Педагоги', screen: 'Teachers', icon: 'people' },
        {
            label: 'Выйти',
            action: () => {
                navigation.navigate('Login');
            },
            icon: 'log-out',
        },
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

            {/* Profile container */}
            <View style={styles.profileContainer}>
                <ProfilePictureComponent profilePicture={userData.profilePicture} sizeMultiplier={0.25} />
                <View style={styles.profileTextContainer}>
                    <Text style={styles.profileName}>
                        {userData.lastName} {userData.firstName}
                    </Text>
                    <Text style={styles.profileEmail}>{userData.email}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItemsContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons name="person-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>Профиль</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Events')}>
                    <Ionicons name="document-text-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>События</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Schedule')}>
                    <Ionicons name="calendar-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>Расписание</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Application')}>
                    <Ionicons name="mic-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>Подать заявку на И/З</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Teachers')}>
                    <Ionicons name="school-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>Педагоги</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Logout')}>
                    <Ionicons name="log-out-outline" size={24} color="#000" style={styles.menuIcon} />
                    <Text style={styles.menuLabel}>Выйти</Text>
                </TouchableOpacity>
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
    profileContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D6DCF1',
        borderRadius: 15,
        padding: 16,
        marginHorizontal: '5%',
        marginVertical: 12,
    },
    profileTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 25.2,
        color: '#000',
    },
    profileEmail: {
        fontSize: 15,
        color: '#555',
        textDecorationLine: 'underline',
        marginTop: 2,
    },
    menuItemsContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
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
