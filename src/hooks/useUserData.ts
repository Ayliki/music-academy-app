import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
                const data = docSnap.data() as UserProfile;
                setUserData({
                    lastName: data.lastName || '',
                    firstName: data.firstName || '',
                    middleName: data.middleName || '',
                    phone: data.phone || '',
                    email: currentUser.email,
                    profilePicture: data.profilePicture ?? undefined,
                    role: data.role || 'default',
                });
            } else {
                setUserData({
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    phone: '',
                    email: currentUser.email,
                    profilePicture: undefined,
                    role: 'default',
                });
            }
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [currentUser]);

    return { userData, isLoading, error, refetch: fetchUserData };
};
