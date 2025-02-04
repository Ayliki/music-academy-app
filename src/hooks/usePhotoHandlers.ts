// src/hooks/usePhotoHandlers.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile, UserProfile } from '../services/userService';
import { auth, db } from '../services/firebaseConfig';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

interface UsePhotoHandlersReturn {
    isPhotoOptionsVisible: boolean;
    setIsPhotoOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddFromGallery: () => Promise<void>;
    handleTakePhoto: () => Promise<void>;
    handleRemovePhoto: () => Promise<void>;
}

const usePhotoHandlers = (
    initialValues: UserProfile | null,
    refetch: () => Promise<void>
): UsePhotoHandlersReturn => {
    const [isPhotoOptionsVisible, setIsPhotoOptionsVisible] = useState(false);
    const currentUser = auth.currentUser;

    // If no initialValues yet, return dummy handlers.
    if (!initialValues) {
        return {
            isPhotoOptionsVisible,
            setIsPhotoOptionsVisible,
            handleAddFromGallery: async () => { },
            handleTakePhoto: async () => { },
            handleRemovePhoto: async () => { },
        };
    }

    const handleAddFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к галерее запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            // Removed mediaTypes option as it is deprecated
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (result.canceled) {
            setIsPhotoOptionsVisible(false);
            return;
        }
        const uri: string = result.assets[0].uri;
        try {
            const updatedProfile: UserProfile = { ...initialValues, profilePicture: uri };
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
        try {
            const updatedProfile: UserProfile = { ...initialValues, profilePicture: uri };
            await updateUserProfile(updatedProfile);
            await refetch();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };

    const handleRemovePhoto = async () => {
        if (!currentUser?.email) return;
        try {
            const docRef = doc(db, 'users', currentUser.email.toLowerCase());
            await updateDoc(docRef, { profilePicture: deleteField() });
            await refetch();
        } catch (error) {
            console.error('Error removing profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };

    return {
        isPhotoOptionsVisible,
        setIsPhotoOptionsVisible,
        handleAddFromGallery,
        handleTakePhoto,
        handleRemovePhoto,
    };
};

export default usePhotoHandlers;
