import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, FlatList, View, Alert } from 'react-native';
import HeaderMenu from '../../components/HeaderMenu';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../navigation/types';
import { collection, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import ApplicationCard, { Application } from '../../components/ApplicationCard';

const AdminApplicationsScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'new' | 'confirmed'>('new');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'applications'), snapshot => {
            const apps: Application[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Application[];
            setApplications(apps);
        });
        return () => unsubscribe();
    }, []);

    const filteredApplications = applications.filter(app =>
        selectedCategory === 'new' ? !app.confirmed : app.confirmed
    );

    const handleConfirmApplication = async (application: Application) => {
        try {
            await updateDoc(doc(db, 'applications', application.id), { confirmed: true });
            const lessonData = {
                dayLabel: application.days ? application.days[0] : '',
                lesson: application.subject,
                confirmed: true,
                teacher: application.teacher,
                startTime: application.startTime,
                endTime: application.endTime,
                createdAt: new Date(),
            };
            await addDoc(collection(db, 'lessons'), lessonData);

            Alert.alert('Успех', 'Заявка подтверждена');
        } catch (error: any) {
            console.error('Error confirming application:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    const handleDeleteApplication = async (application: Application) => {
        try {
            await deleteDoc(doc(db, 'applications', application.id));
            Alert.alert('Успех', 'Заявка удалена');
        } catch (error: any) {
            console.error('Error deleting application:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    const renderItem = ({ item }: { item: Application }) => (
        <ApplicationCard
            application={item}
            onConfirm={!item.confirmed ? handleConfirmApplication : undefined}
            onDelete={handleDeleteApplication}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu title="Заявки" onBack={() => navigation.navigate('AdminMenu')} />
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'new' && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory('new')}
                >
                    <Text style={styles.buttonText}>Новые</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'confirmed' && styles.categoryButtonActive,
                    ]}
                    onPress={() => setSelectedCategory('confirmed')}
                >
                    <Text style={styles.buttonText}>Принятые</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredApplications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Нет заявок для выбранной категории
                    </Text>
                }
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
};

export default AdminApplicationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    listContentContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    categoryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#3192BB',
        backgroundColor: '#3192BB',
        borderRadius: 8,
        marginHorizontal: 5,
        minWidth: 120,
    },
    categoryButtonActive: {
        backgroundColor: '#3176BB',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    buttonTextActive: {
        color: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },

});
