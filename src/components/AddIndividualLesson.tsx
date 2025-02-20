import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
} from 'firebase/firestore';
import {db} from '../services/firebaseConfig';

type AddGroupLessonProps = {
    onClose: () => void; // чтобы закрыть попап
};

const AddGroupLesson: React.FC<AddGroupLessonProps> = ({onClose}) => {
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

    const [groups, setGroups] = useState<any[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    // Допустим, мы сохраняем какую-то дату (dayLabel) или берём текущую
    const [dayLabel, setDayLabel] = useState<string>('сб 30 ноя'); // временно

    // Загрузка предметов
    useEffect(() => {
        const qSubj = query(collection(db, 'subjects'));
        const unsubscribe = onSnapshot(qSubj, (snapshot) => {
            const loaded = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setSubjects(loaded);
        });
        return () => unsubscribe();
    }, []);

    // Загрузка учителей
    useEffect(() => {
        if (!selectedSubject) {
            setTeachers([]);
            setSelectedTeacher(null);
            return;
        }
        const qTeachers = query(
            collection(db, 'users'),
            where('subjectId', '==', selectedSubject)
            // возможно, where('role', '==', 'teacher')
        );
        const unsubscribe = onSnapshot(qTeachers, (snapshot) => {
            const loaded = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setTeachers(loaded);
        });
        return () => unsubscribe();
    }, [selectedSubject]);

    // Загрузка групп
    useEffect(() => {
        const qGroups = query(collection(db, 'groups'));
        const unsubscribe = onSnapshot(qGroups, (snapshot) => {
            const loaded = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setGroups(loaded);
        });
        return () => unsubscribe();
    }, []);

    const handleSaveGroupLesson = async () => {
        if (!selectedSubject || !selectedTeacher || !selectedGroup) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        try {
            await addDoc(collection(db, 'lessons'), {
                subjectId: selectedSubject,
                teacherId: selectedTeacher,
                groupId: selectedGroup,
                dayLabel,
                isGroup: true,
                confirmed: false,
            });
            alert('Групповое занятие добавлено!');
            onClose(); // Закрываем попап
        } catch (error) {
            console.error('Error adding group lesson:', error);
            alert('Ошибка при добавлении занятия');
        }
    };

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.title}>Добавить групповое занятие</Text>

            <Text style={styles.label}>Предмет:</Text>
            <Picker
                selectedValue={selectedSubject}
                onValueChange={(value) => setSelectedSubject(value)}
                style={styles.picker}
            >
                <Picker.Item label="-- Выберите предмет --" value={null}/>
                {subjects.map((subj) => (
                    <Picker.Item key={subj.id} label={subj.name} value={subj.id}/>
                ))}
            </Picker>

            <Text style={styles.label}>Преподаватель:</Text>
            <Picker
                selectedValue={selectedTeacher}
                onValueChange={(value) => setSelectedTeacher(value)}
                style={styles.picker}
                enabled={!!selectedSubject}
            >
                <Picker.Item label="-- Выберите преподавателя --" value={null}/>
                {teachers.map((t) => (
                    <Picker.Item
                        key={t.id}
                        label={t.fullName || 'Без имени'}
                        value={t.id}
                    />
                ))}
            </Picker>

            <Text style={styles.label}>Группа:</Text>
            <Picker
                selectedValue={selectedGroup}
                onValueChange={(value) => setSelectedGroup(value)}
                style={styles.picker}
            >
                <Picker.Item label="-- Выберите группу --" value={null}/>
                {groups.map((g) => (
                    <Picker.Item key={g.id} label={g.name} value={g.id}/>
                ))}
            </Picker>

            {/* Если нужно выбрать конкретную дату/время, можно добавить DatePicker или другой UI. */}

            <View style={styles.buttonRow}>
                <Button title="Отмена" onPress={onClose}/>
                <Button title="Сохранить" onPress={handleSaveGroupLesson}/>
            </View>
        </View>
    );
};

export default AddGroupLesson;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 18,
        marginBottom: 12,
        fontWeight: '600',
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontSize: 16,
    },
    picker: {
        backgroundColor: '#f2f2f2',
        borderRadius: 6,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
});