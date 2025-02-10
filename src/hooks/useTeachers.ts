import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "src/services/firebaseConfig";

export type Teacher = {
    id: string;
    name: string;
    subject: string;
    photo: string;
};

export const useTeachers = (): { teachers: Teacher[]; setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>> } => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    useEffect(() => {
        const teachersCol = collection(db, 'teachers');
        const unsubscribe = onSnapshot(teachersCol, (snapshot) => {
            console.log("Received snapshot, count:", snapshot.docs.length);
            snapshot.docs.forEach(doc => {
                console.log("Document", doc.id, "data:", doc.data());
            });
            const teachersData = snapshot.docs.map(doc => {
                const data = doc.data();
                const firstName = data.firstName ? data.firstName.toString().trim() : "";
                const lastName = data.lastName ? data.lastName.toString().trim() : "";
                const displayName = `${lastName} ${firstName}`
                return {
                    id: doc.id,
                    name: displayName,
                    subject: data.subject,
                    photo: data.photo,
                };
            });
            console.log("Mapped teachersData:", teachersData);
            setTeachers(teachersData);
        });
        return () => unsubscribe();
    }, []);


    return { teachers, setTeachers };
};
