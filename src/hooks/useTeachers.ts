import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "src/services/firebaseConfig";

export const useTeachers = (): { teachers: any[]; setTeachers: React.Dispatch<React.SetStateAction<any[]>> } => {
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