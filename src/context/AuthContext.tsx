import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {auth, db} from '../services/firebaseConfig';
import {onAuthStateChanged, User as FirebaseAuthUser} from 'firebase/auth';
import {doc, onSnapshot, Unsubscribe} from 'firebase/firestore';

interface UserData {
    email: string;
    role: string;
    confirmed?: boolean;
    codeVerified?: boolean;
    groupId?: string;
}

interface AuthContextType {
    firebaseUser: FirebaseAuthUser | null;
    dbUser: UserData | null;
    loading: boolean;
    role: string | null;
    setRole: (role: string | null) => void;
    confirmed: boolean | null;
    setConfirmed: (confirmed: boolean) => void;
    codeVerified: boolean;
    setCodeVerified: (verified: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null>(null);
    const [dbUser, setDbUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState<boolean | null>(null);
    const [codeVerified, setCodeVerified] = useState<boolean>(false);

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;
        const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
            setFirebaseUser(authenticatedUser);
            if (authenticatedUser) {
                const userDocRef = doc(db, 'users', authenticatedUser.email?.toLowerCase() || '');
                unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        setDbUser(data);
                        setRole(data.role || 'default');
                        setConfirmed(data.confirmed ?? false);
                        setCodeVerified(data.codeVerified ?? false);
                    } else {
                        setDbUser(null);
                        setRole('default');
                        setConfirmed(false);
                        setCodeVerified(false);
                    }
                });
            } else {
                setDbUser(null);
                setRole(null);
                setConfirmed(null);
                setCodeVerified(false);
            }
            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                firebaseUser,
                dbUser,
                loading,
                role,
                setRole,
                confirmed,
                setConfirmed,
                codeVerified,
                setCodeVerified,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};