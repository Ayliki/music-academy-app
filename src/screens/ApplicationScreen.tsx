import React, { useState } from 'react';
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderMenu from '../components/HeaderMenu';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import CustomAlert from '../components/CustomAlert';
import { addDoc, collection } from 'firebase/firestore';
import { db } from 'src/services/firebaseConfig';
import { useUserData } from 'src/hooks/useUserData';

const ApplicationScreen: React.FC = () => {
    const navigation = useNavigation();
    const { userData } = useUserData();

    const [alertVisible, setAlertVisible] = useState(false);

    // Dropdown state for "День недели"
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];

    // Time interval state
    const [startTime, setStartTime] = useState('10:00');
    const [endTime, setEndTime] = useState('12:00');

    // Dropdown state for "Выберите предмет"
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    // todo переделать под firestore
    const subjects = ['Вокал', 'Хореография', 'Фортепиано', 'Актерское Мастерство', 'Сольфеджио'];

    // Dropdown state for "Выберите преподавателя"
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
    // todo переделать под firestore
    const teachers = ['Юля', 'Камила', 'Карина', 'Мария', 'Не важно'];

    const handleSubmit = async () => {
        try {
            const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'Неизвестный пользователь';
            await addDoc(collection(db, 'applications'), {
                name: fullName,
                days: selectedDays,
                startTime,
                endTime,
                subject: selectedSubjects,
                teacher: selectedTeachers,
                confirmed: false,
                createdAt: new Date(),
            });
            setAlertVisible(true);
        } catch (error: any) {
            console.error('Error saving application:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <HeaderMenu title={'Подать заявку на И/З'} onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.container}>
                {/* День недели Dropdown */}
                <MultiSelectDropdown
                    label="День недели"
                    options={days}
                    selectedOptions={selectedDays}
                    onSelectionChange={setSelectedDays}
                    placeholder="Выберите день недели"
                />

                {/* Временной промежуток */}
                <Text style={styles.label}>Выберите временной промежуток</Text>
                <TextInput
                    style={styles.timeInput}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="с 10:00"
                />
                <TextInput
                    style={styles.timeInput}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="до 12:00"
                />

                {/* Выберите предмет Dropdown */}
                <MultiSelectDropdown
                    label="Выберите предмет"
                    options={subjects}
                    selectedOptions={selectedSubjects}
                    onSelectionChange={setSelectedSubjects}
                    placeholder="Выберите предмет"
                />

                {/* Выберите преподавателя Dropdown */}
                <MultiSelectDropdown
                    label="Выберите преподавателя"
                    options={teachers}
                    selectedOptions={selectedTeachers}
                    onSelectionChange={setSelectedTeachers}
                    placeholder="Выберите преподавателя"
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Отправить заявку</Text>
                </TouchableOpacity>
            </ScrollView>

            <CustomAlert visible={alertVisible} onClose={() => setAlertVisible(false)} />
        </SafeAreaView>
    );
};

export default ApplicationScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 16,
    },
    label: {
        fontFamily: 'Outfit',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 16,
        marginVertical: 8,
    },
    timeContainer: {
        flexDirection: 'column',
        marginBottom: 16,
    },
    timeInput: {
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#6C6A6A',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        width: 328,
        minHeight: 48,
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 32,
        backgroundColor: '#98A7DD',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
