import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';

const useTeachers = (): { teachers: any[]; setTeachers: React.Dispatch<React.SetStateAction<any[]>> } => {
    const [teachers, setTeachers] = useState<any[]>([]);

    useEffect(() => {
        const teachersCol = collection(db, 'teachers');
        const unsubscribe = onSnapshot(teachersCol, (snapshot) => {
            const teachersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTeachers(teachersData);
        });
        return () => unsubscribe();
    }, []);

    return { teachers, setTeachers };
};

const teacherImages: { [key: string]: any } = {
    'teacher1.jpg': require('../../assets/images/teachers/teacher1.png'),
    'teacher2.jpg': require('../../assets/images/teachers/teacher2.png'),
    'teacher3.jpg': require('../../assets/images/teachers/teacher3.png'),
    'teacher4.jpg': require('../../assets/images/teachers/teacher4.png'),
    'teacher5.jpg': require('../../assets/images/teachers/teacher5.png'),
};

const TeachersScreen: React.FC = () => {
    const { teachers } = useTeachers();
    const navigation = useNavigation<NavigationProps>();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => {
                    navigation.navigate('Menu')
                }}>
                    <Ionicons name="chevron-back" size={32} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Педагоги</Text>
            </View>

            {/* Teachers List */}
            <ScrollView contentContainerStyle={styles.teacherList}>
                {teachers.map((teacher) => (
                    <View key={teacher.id} style={styles.card}>
                        <Image
                            source={teacherImages[teacher.photo]}
                            style={styles.profileImage}
                        />
                        <View style={styles.cardContent}>
                            <View style={styles.teacherInfo}>
                                <Text style={styles.label}>Имя: </Text>
                                <Text style={styles.teacherName}>{teacher.name}</Text>
                            </View>
                            <View style={styles.teacherInfo}>
                                <Text style={styles.label}>Предмет:</Text>
                                <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default TeachersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        fontFamily: 'Outfit',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 16,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    teacherList: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        borderWidth: 3,
        borderColor: '#EEEEEE',
        borderRadius: 15,
        maxWidth: 369,
        maxHeight: 250,
    },
    imageContainer: {
        width: 150,
        height: 189,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 150,
        height: 189,
        resizeMode: 'contain',
        borderRadius: 15,
        transform: [{ scale: 0.8 }],
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'flex-start',
        marginTop: 8
    },
    teacherInfo: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    label: {
        fontWeight: '400',
        fontSize: 18,
        marginRight: 4,
    },
    teacherName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    teacherSubject: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
});  