import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
import LoadingOverlay from '../components/LoadingOverlay';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, getDoc, deleteField } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import CustomAlert from '../components/CustomAlert';
import { UserProfile } from '../services/userService';
import { updateUserProfile } from '../services/userService';
import PhotoOptionsModal from '../components/PhotoOptionsModal';
import ProfilePictureComponent from '../components/ProfilePicture';
import { auth, db } from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { useUserData } from '../hooks/useUserData';
import HeaderMenu from '../components/HeaderMenu';
import AvatarSection from '../components/AvatarSection';
import ProfileForm from '../components/ProfileForm';

const ProfileScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const navigation = useNavigation();
    const { userData: initialValues, isLoading, error, refetch } = useUserData();
    const [isAlertVisible, setIsAlertVisible] = React.useState(false);
    const [isPhotoOptionsVisible, setIsPhotoOptionsVisible] = React.useState(false);

    const currentUser = auth.currentUser;

    if (isLoading || !initialValues) {
        return <LoadingOverlay visible={true} />;
    }

    const isTeacher = initialValues.role === 'teacher';

    // Photo handlers
    const handleAddFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к галерее запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) {
            setIsPhotoOptionsVisible(false);
            return;
        }

        const uri: string = result.assets[0].uri;
        console.log('Selected image:', uri);
        try {
            const updatedProfile: UserProfile = {
                ...initialValues!,
                profilePicture: uri,
            };
            await updateUserProfile(updatedProfile);
            await refetch();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к камере запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) {
            setIsPhotoOptionsVisible(false);
            return;
        }

        const uri: string = result.assets[0].uri;
        console.log('Captured image:', uri);
        try {
            const updatedProfile: UserProfile = {
                ...initialValues!,
                profilePicture: uri,
            };
            await updateUserProfile(updatedProfile);
            await refetch();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };

    const handleRemovePhoto = async () => {
        if (!currentUser?.email) return;
        console.log('Remove photo');
        try {
            const docRef = doc(db, 'users', currentUser.email.toLowerCase());
            await updateDoc(docRef, {
                profilePicture: deleteField(),
            });
            await refetch();
        } catch (error) {
            console.error('Error removing profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Pop up Alert */}
            <CustomAlert visible={isAlertVisible} onClose={() => setIsAlertVisible(false)} />
            {/* Pop up Photo Options Modal */}
            <PhotoOptionsModal
                visible={isPhotoOptionsVisible}
                onClose={() => setIsPhotoOptionsVisible(false)}
                onAddFromGallery={handleAddFromGallery}
                onTakePhoto={handleTakePhoto}
                onRemovePhoto={handleRemovePhoto}
            />
            {/* Header */}
            <HeaderMenu onBack={() => navigation.goBack()} />

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