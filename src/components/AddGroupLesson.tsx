import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {db} from '../services/firebaseConfig';
import {
    collection,
    onSnapshot,
    query,
    addDoc,
} from 'firebase/firestore';

type AddGroupLessonPopupProps = {
    onClose: () => void; // чтобы закрыть попап по кнопке или после сохранения
};

const AddGroupLessonPopup: React.FC<AddGroupLessonPopupProps> = ({onClose}) => {
    // Списки для выбора
    const [subjects, setSubjects] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);

    // Выбранные значения
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [teacherName, setTeacherName] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

    // Загрузка предметов
    useEffect(() => {
        const qSubj = query(collection(db, 'subjects'));
        const unsub = onSnapshot(qSubj, snapshot => {
            const loadedSubjects: any[] = [];
            snapshot.forEach(doc => {
                loadedSubjects.push({id: doc.id, ...doc.data()});
            });
            setSubjects(loadedSubjects);
        });
        return () => unsub();
    }, []);

    // Загрузка «кабинетов»
    useEffect(() => {
        const qRooms = query(collection(db, 'rooms'));
        const unsub = onSnapshot(qRooms, snapshot => {
            const loadedRooms: any[] = [];
            snapshot.forEach(doc => {
                loadedRooms.push({id: doc.id, ...doc.data()});
            });
            setRooms(loadedRooms);
        });
        return () => unsub();
    }, []);

    // Сохранение
    const handleSave = async () => {
        // Валидация
        if (!selectedSubject || !teacherName || !groupName || !selectedRoom) {
            alert('Заполните все поля');
            return;
        }

        try {
            await addDoc(collection(db, 'lessons'), {
                subjectId: selectedSubject,
                teacherName,
                groupName,
                roomId: selectedRoom,
                isGroup: true,
            });
            alert('Групповое занятие создано!');
            onClose(); // Закрыть попап
        } catch (error) {
            console.error('Error adding lesson:', error);
            alert('Ошибка при добавлении');
        }
    };

    // Флаг, указывающий, выбрал ли пользователь предмет
    const isSubjectSelected = !!selectedSubject;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} onPress={onClose}/>

            <View style={styles.modalContainer}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Выберите вариант:</Text>

                    {/* Выбор предмета */}
                    <Text style={styles.label}>Выберите предмет</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedSubject}
                            onValueChange={val => setSelectedSubject(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="-- Выберите предмет --" value={null}/>
                            {subjects.map(sub => (
                                <Picker.Item key={sub.id} label={sub.name} value={sub.id}/>
                            ))}
                        </Picker>
                    </View>

                    {/* Остальные поля (будут неактивны, пока предмет не выбран) */}
                    <Text style={styles.label}>Введите имя педагога</Text>
                    <TextInput
                        style={[
                            styles.input,
                            !isSubjectSelected && styles.disabledInput // визуально затемняем
                        ]}
                        placeholder="Имя"
                        value={teacherName}
                        onChangeText={setTeacherName}
                        editable={isSubjectSelected} // запрет ввода до выбора предмета
                    />

                    <Text style={styles.label}>Введите наименование группы</Text>
                    <TextInput
                        style={[
                            styles.input,
                            !isSubjectSelected && styles.disabledInput
                        ]}
                        placeholder="Группа"
                        value={groupName}
                        onChangeText={setGroupName}
                        editable={isSubjectSelected}
                    />

                    <Text style={styles.label}>Выберите кабинет</Text>
                    <View style={[
                        styles.pickerContainer,
                        !isSubjectSelected && styles.disabledPickerContainer
                    ]}>
                        <Picker
                            selectedValue={selectedRoom}
                            onValueChange={val => setSelectedRoom(val)}
                            style={styles.picker}
                            enabled={isSubjectSelected} // выключаем, если предмет не выбран
                        >
                            <Picker.Item label="-- Выберите кабинет --" value={null}/>
                            {rooms.map(r => (
                                <Picker.Item key={r.id} label={r.name} value={r.id}/>
                            ))}
                        </Picker>
                    </View>

                    {/* Кнопка Сохранить (заблокирована, пока предмет не выбран) */}
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!selectedSubject || !teacherName || !groupName || !selectedRoom) && styles.saveButtonDisabled
                        ]}
                        onPress={handleSave}
                        disabled={!selectedSubject || !teacherName || !groupName || !selectedRoom}
                    >
                        <Text style={styles.saveButtonText}>Сохранить</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default AddGroupLessonPopup;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    scrollContainer: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        marginBottom: 8,
    },
    disabledPickerContainer: {
        // При желании можно добавить полупрозрачность
        opacity: 0.5,
    },
    picker: {
        width: '100%',
        height: 40,
    },
    input: {
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 8,
    },
    disabledInput: {
        // Вариант для визуального эффекта "неактивного" поля
        opacity: 0.5,
    },
    saveButton: {
        backgroundColor: '#2F80ED',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginVertical: 12,
    },
    saveButtonDisabled: {
        // Кнопка, когда отключена
        opacity: 0.5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});