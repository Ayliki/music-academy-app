import React, { useEffect, useState } from 'react';
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
import * as Yup from 'yup';
import { auth, db } from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

// Validation schema for the profile form
const ProfileSchema = Yup.object().shape({
    lastName: Yup.string().required('Фамилия обязательна'),
    firstName: Yup.string().required('Имя обязательно'),
    middleName: Yup.string(),
    phone: Yup.string().matches(/^\+7\d{10}$/, 'Некорректный номер'),
    email: Yup.string().email('Некорректный email'),
});

const ProfileScreen: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const navigation = useNavigation();
    const currentUser = auth.currentUser;
    const [initialValues, setInitialValues] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [isPhotoOptionsVisible, setIsPhotoOptionsVisible] = useState(false);

    // Fetch user data from Firestore
    const fetchUserData = async () => {
        if (!currentUser?.email) {
            console.log('No current user or email available');
            setIsLoading(false);
            return;
        }
        try {
            const docRef = doc(db, 'users', currentUser.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setInitialValues({
                    lastName: data.lastName || '',
                    firstName: data.firstName || '',
                    middleName: data.middleName || '',
                    phone: data.phone || '',
                    email: currentUser.email,
                    profilePicture: data.profilePicture,
                });
            } else {
                setInitialValues({
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    phone: '',
                    email: currentUser.email || '',
                    profilePicture: undefined,
                });
            }
        } catch (error) {
            console.log('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    if (isLoading || !initialValues) {
        return <LoadingOverlay visible={true} />;
    }

    const handleAddFromGallery = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к галерее запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        // Launch image picker for images only, with square aspect ratio
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
            await fetchUserData();
        } catch (error) {
            console.error('Error updating profile picture:', error);
        }
        setIsPhotoOptionsVisible(false);
    };

    const handleTakePhoto = async () => {
        // Request permission to access the camera
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Доступ к камере запрещён!');
            setIsPhotoOptionsVisible(false);
            return;
        }
        // Launch the camera with square aspect ratio editing
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
            await fetchUserData();
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
            await fetchUserData();
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
            <View style={[styles.headerContainer, { paddingHorizontal: width * 0.05 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Профиль</Text>
                <View style={{ width: 30 }} />
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: width * 0.05 }]}>
                {/* Profile picture, name, and email section */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={() => setIsPhotoOptionsVisible(true)}>
                        <ProfilePictureComponent profilePicture={initialValues.profilePicture} />
                    </TouchableOpacity>
                    <Text style={styles.userName}>
                        {initialValues.lastName} {initialValues.firstName}
                    </Text>
                    <Text style={styles.userEmail}>{initialValues.email}</Text>
                </View>

                <Formik
                    initialValues={initialValues}
                    validationSchema={ProfileSchema}
                    onSubmit={async (values) => {
                        try {
                            await updateUserProfile(values);
                            setIsAlertVisible(true);
                        } catch (error: any) {
                            console.error('Error saving profile:', error);
                        }
                    }}
                >
                    {({
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        isSubmitting,
                        dirty,
                    }) => (
                        <View style={styles.formContainer}>
                            {/* Фамилия ребенка */}
                            <Text style={styles.label}>Фамилия ребенка</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Иванова"
                                onChangeText={handleChange('lastName')}
                                onBlur={handleBlur('lastName')}
                                value={values.lastName}
                            />
                            {touched.lastName && errors.lastName && (
                                <Text style={styles.error}>{errors.lastName}</Text>
                            )}

                            {/* Имя ребенка */}
                            <Text style={styles.label}>Имя ребенка</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Алиса"
                                onChangeText={handleChange('firstName')}
                                onBlur={handleBlur('firstName')}
                                value={values.firstName}
                            />
                            {touched.firstName && errors.firstName && (
                                <Text style={styles.error}>{errors.firstName}</Text>
                            )}

                            {/* Отчество ребенка (при наличии) */}
                            <Text style={styles.label}>Отчество ребенка (при наличии)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Андреевна"
                                onChangeText={handleChange('middleName')}
                                onBlur={handleBlur('middleName')}
                                value={values.middleName}
                            />
                            {touched.middleName && errors.middleName && (
                                <Text style={styles.error}>{errors.middleName}</Text>
                            )}

                            {/* Номер телефона родителя */}
                            <Text style={styles.label}>Номер телефона родителя</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+7 (999) 959-49-69"
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                value={values.phone}
                                keyboardType="phone-pad"
                            />
                            {touched.phone && errors.phone && (
                                <Text style={styles.error}>{errors.phone}</Text>
                            )}

                            {/* E-mail */}
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={[styles.input, { color: '#999' }]}
                                placeholder="ivanovaalice@gmail.com"
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                editable={false}
                            />
                            {touched.email && errors.email && (
                                <Text style={styles.error}>{errors.email}</Text>
                            )}

                            {/* Submit button */}
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => handleSubmit()}
                                disabled={!dirty || isSubmitting}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
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
    scrollContent: {
        paddingBottom: 32,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444',
        marginTop: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
        textDecorationLine: 'underline',
    },
    formContainer: {
        width: '90%',
        alignSelf: 'center',
    },
    label: {
        marginBottom: 6,
        fontFamily: 'Outfit',
        fontWeight: '600',
        fontSize: 16,
        color: '#000',
    },
    input: {
        height: 48,
        borderWidth: 0.7,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: -12,
        marginBottom: 16,
    },
    submitButton: {
        height: 52,
        backgroundColor: '#9999FF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 32,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
