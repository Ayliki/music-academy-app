import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';
import CustomAlert from '../components/CustomAlert';
import { updateUserProfile } from '../services/userService';
import PhotoOptionsModal from '../components/PhotoOptionsModal';
import { useUserData } from '../hooks/useUserData';
import HeaderMenu from '../components/HeaderMenu';
import AvatarSection from '../components/AvatarSection';
import ProfileForm from '../components/ProfileForm';
import usePhotoHandlers from '../hooks/usePhotoHandlers';

const ProfileScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const { userData: initialValues, isLoading, error, refetch } = useUserData();
    const [isAlertVisible, setIsAlertVisible] = React.useState(false);

    const {
        isPhotoOptionsVisible,
        setIsPhotoOptionsVisible,
        handleAddFromGallery,
        handleTakePhoto,
        handleRemovePhoto,
    } = usePhotoHandlers(initialValues, refetch);

    if (isLoading || !initialValues) {
        return <LoadingOverlay visible={true} />;
    }

    const isTeacher = initialValues.role === 'teacher';

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Pop up Alert */}
            <CustomAlert visible={isAlertVisible} onClose={() => setIsAlertVisible(false)} role={initialValues.role} />
            {/* Pop up Photo Options Modal */}
            <PhotoOptionsModal
                visible={isPhotoOptionsVisible}
                onClose={() => setIsPhotoOptionsVisible(false)}
                onAddFromGallery={handleAddFromGallery}
                onTakePhoto={handleTakePhoto}
                onRemovePhoto={handleRemovePhoto}
                role={initialValues.role}
            />
            {/* Header */}
            <HeaderMenu title={'Профиль'} onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: width * 0.05 }]}>
                <AvatarSection
                    profile={initialValues}
                    isTeacher={isTeacher}
                    onPhotoOptions={() => setIsPhotoOptionsVisible(true)}
                />
                <ProfileForm
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        try {
                            await updateUserProfile(values);
                            setIsAlertVisible(true);
                        } catch (error: any) {
                            console.error('Error saving profile:', error);
                        }
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    scrollContent: {
        paddingBottom: 32,
    },
});