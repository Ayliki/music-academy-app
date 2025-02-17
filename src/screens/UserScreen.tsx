import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, Text, FlatList, View, Alert } from 'react-native';
import HeaderMenu from 'src/components/HeaderMenu';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from 'src/navigation/types';
import { useAuth } from 'src/context/AuthContext';
import { collection, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/services/firebaseConfig';
import UserCard, { User } from 'src/components/userCard';

const UsersScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const { role } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<'new' | 'confirmed'>('new');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), snapshot => {
            const usersData: User[] = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as User[];
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(user => {
        return selectedCategory === 'new' ? !user.confirmed : user.confirmed;
    });

    const handleConfirmUser = async (user: User) => {
        try {
            await updateDoc(doc(db, 'users', user.id), { confirmed: true });
            Alert.alert('Успех', 'Пользователь подтвержден');
        } catch (error: any) {
            console.error('Error confirming user:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    const handleDeleteUser = async (user: User) => {
        try {
            await deleteDoc(doc(db, 'users', user.id));
            Alert.alert('Успех', 'Пользователь удален');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    const renderItem = ({ item }: { item: User }) => (
        <UserCard
            user={item}
            onConfirm={!item.confirmed ? handleConfirmUser : undefined}
            onDelete={handleDeleteUser}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <HeaderMenu title="Пользователи" onBack={() => navigation.navigate('AdminMenu')} />
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.categoryButton, selectedCategory === 'new' && styles.categoryButtonActive]}
                    onPress={() => setSelectedCategory('new')}
                >
                    <Text style={[styles.buttonText, selectedCategory === 'new' && styles.buttonTextActive]}>Новые</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.categoryButton, selectedCategory === 'confirmed' && styles.categoryButtonActive]}
                    onPress={() => setSelectedCategory('confirmed')}
                >
                    <Text style={[styles.buttonText, selectedCategory === 'confirmed' && styles.buttonTextActive]}>Добавленные</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.emptyText}>Нет пользователей для выбранной категории</Text>}
                contentContainerStyle={styles.listContentContainer}
            />
        </SafeAreaView>
    );
};

export default UsersScreen;

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
        minWidth: 140,
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
        textAlign: 'center',
        fontSize: 16,
        color: '#ffff',
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
