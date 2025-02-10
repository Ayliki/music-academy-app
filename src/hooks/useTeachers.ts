import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "src/services/firebaseConfig";

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

    useEffect(() => {
        const q = query(
            collection(db, "users"),
            where("role", "==", "teacher")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("Received snapshot, count:", snapshot.docs.length);
            snapshot.docs.forEach(doc => {
                console.log("Document", doc.id, "data:", doc.data());
            });

            const teachersData = snapshot.docs.map(doc => {
                const data = doc.data();
                const firstName = data.firstName ? data.firstName.toString().trim() : "";
                const lastName = data.lastName ? data.lastName.toString().trim() : "";
                // Build display name as "LastName FirstName"
                const displayName = `${lastName} ${firstName}`;

                return {
                    id: doc.id,
                    name: displayName,
                    subject: data.selection || "",
                    photo: data.photo || ""
                };
            });

            setTeachers(teachersData);
        });

        return () => unsubscribe();
    }, []);

    return { teachers, setTeachers };
};
