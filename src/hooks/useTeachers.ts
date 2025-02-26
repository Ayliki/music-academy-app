import {useEffect, useState} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "src/services/firebaseConfig";

export type Teacher = {
    id: string;
    name: string;
    subject: string;
    photo: string;
};

export const useTeachers = (): {
    teachers: Teacher[];
    setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>
} => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [subjectsMapping, setSubjectsMapping] = useState<Record<string, string>>({});

    // Подписка на коллекцию subjects для получения названий предметов по ID
    useEffect(() => {
        const unsubscribeSubjects = onSnapshot(collection(db, "subjects"), (snapshot) => {
            const mapping: Record<string, string> = {};
            snapshot.docs.forEach(doc => {
                // Предполагается, что в документе хранится поле name с названием предмета
                mapping[doc.id] = doc.data().name;
            });
            setSubjectsMapping(mapping);
        });

        return () => unsubscribeSubjects();
    }, []);

    // Подписка на коллекцию пользователей с ролью "teacher"
    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "teacher")
        );

        const unsubscribeTeachers = onSnapshot(q, (snapshot) => {
            const teachersData = snapshot.docs.map(doc => {
                const data = doc.data();
                const firstName = data.firstName ? data.firstName.toString().trim() : "";
                const lastName = data.lastName ? data.lastName.toString().trim() : "";
                const displayName = `${lastName} ${firstName}`;

                // Получаем ID предмета и сопоставляем его с названием
                const subjectId = data.subjectId || "";
                const subjectName = subjectsMapping[subjectId] || "";

                return {
                    id: doc.id,
                    name: displayName,
                    subject: subjectName,
                    photo: data.photo || ""
                };
            });

            setTeachers(teachersData);
        });

        return () => unsubscribeTeachers();
    }, [subjectsMapping]); // Обновляем учителей при изменении subjectsMapping

    return {teachers, setTeachers};
};