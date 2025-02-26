import { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { UserProfile } from '../services/userService';

interface UseUserDataReturn {
    userData: UserProfile | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const currentUser = auth.currentUser;

    const fetchUserData = async () => {
        if (!currentUser?.email) {
            setError(new Error('No current user or email available'));
            setIsLoading(false);
            return;
        }
        try {
            const docRef = doc(db, 'users', currentUser.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setUserData({
                    lastName: docSnap.data().lastName || '',
                    firstName: docSnap.data().firstName || '',
                    middleName: docSnap.data().middleName || '',
                    phone: docSnap.data().phone || '',
                    email: currentUser.email,
                    profilePicture:
                        docSnap.data().profilePicture === null
                            ? undefined
                            : docSnap.data().profilePicture,
                    role: docSnap.data().role || 'default',
                });
            } else {
                setUserData(null);
            }
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser?.email) return;

        const docRef = doc(db, 'users', currentUser.email.toLowerCase());
        const unsubscribe = onSnapshot(
            docRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    setUserData({
                        lastName: docSnap.data().lastName || '',
                        firstName: docSnap.data().firstName || '',
                        middleName: docSnap.data().middleName || '',
                        phone: docSnap.data().phone || '',
                        email: currentUser.email !== null ? currentUser.email : undefined,
                        profilePicture:
                            docSnap.data().profilePicture === null
                                ? undefined
                                : docSnap.data().profilePicture,
                        role: docSnap.data().role || 'default',
                    });
                }
                setIsLoading(false);
            },
            (error) => {
                console.error('Error fetching user data:', error);
                setError(error);
                setIsLoading(false);
            }
        );

        return () => unsubscribe();
    }, [currentUser?.email]);

    return { userData, isLoading, error, refetch: fetchUserData };
};
