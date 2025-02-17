import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, FlatList, View, Alert } from 'react-native';
import HeaderMenu from 'src/components/HeaderMenu';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/services/firebaseConfig';
import ApplicationCard, { Application } from 'src/components/ApplicationCard';

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
    },
    categoryButtonActive: {
        backgroundColor: '#3176BB',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
    },
    listContentContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
});
