// src/hooks/usePhotoHandlers.ts
import {useState} from 'react';
import * as ImagePicker from 'expo-image-picker';
import {updateUserProfile, UserProfile} from '../services/userService';
import {auth, db} from '../services/firebaseConfig';
import {doc, updateDoc, deleteField} from 'firebase/firestore';
import {uploadImageAsync} from "../utils/uploadImageAsync";
import {Alert} from "react-native";

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
            handleAddFromGallery: async () => {
            },
            handleTakePhoto: async () => {
            },
            handleRemovePhoto: async () => {
            },
        };
    }

    const handleAddFromGallery = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к галерее запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (result.canceled) {
            setIsPhotoOptionsVisible(false);
            return;
        }
        const localUri = result.assets[0].uri;
        try {
            const downloadURL = await uploadImageAsync(localUri);
            try {
                const updatedProfile: UserProfile = {...initialValues, profilePicture: downloadURL};
                await updateUserProfile(updatedProfile);
                await refetch();
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }

            Alert.alert("Успех", "Изображение успешно загружено");
        } catch (error) {
            console.error("Ошибка загрузки изображения", error);
            console.log(JSON.stringify(error));
            Alert.alert("Ошибка", "Не удалось загрузить изображение");
        }

        setIsPhotoOptionsVisible(false);
    };

    const handleTakePhoto = async () => {
        const {status} = await ImagePicker.requestCameraPermissionsAsync();
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
        const localUri = result.assets[0].uri;
        try {
            const downloadURL = await uploadImageAsync(localUri);
            try {
                const updatedProfile: UserProfile = {...initialValues, profilePicture: downloadURL};
                await updateUserProfile(updatedProfile);
                await refetch();
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }

            Alert.alert("Успех", "Изображение успешно загружено");
        } catch (error) {
            console.error("Ошибка загрузки изображения", error);
            console.log(JSON.stringify(error));
            Alert.alert("Ошибка", "Не удалось загрузить изображение");
        }
        setIsPhotoOptionsVisible(false);
    };

    const handleRemovePhoto = async () => {
        if (!currentUser?.email) return;
        try {
            const docRef = doc(db, 'users', currentUser.email.toLowerCase());
            await updateDoc(docRef, {profilePicture: deleteField()});
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
