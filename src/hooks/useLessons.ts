import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export const useLessons = () => {
    const [lessons, setLessons] = useState<any[]>([]);

    useEffect(() => {
        const lessonsCol = collection(db, 'lessons');
        const unsubscribe = onSnapshot(lessonsCol, (snapshot) => {
            const lessonsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLessons(lessonsData);
        });
        return () => unsubscribe();
    }, []);

    return { lessons, setLessons };
};
