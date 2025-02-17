import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

type Role = 'default' | 'teacher' | 'administrator' | null;

interface AuthContextType {
    user: FirebaseAuthUser | null;
    loading: boolean;
    role: Role;
    setRole: (role: Role) => void;
    confirmed: boolean | null;
    setConfirmed: (confirmed: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<FirebaseAuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(null);
    const [confirmed, setConfirmed] = useState<boolean | null>(null);

    useEffect(() => {
        let unsubscribe: Unsubscribe | undefined;
        const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
            setUser(authenticatedUser);

            if (authenticatedUser) {
                const userDocRef = doc(db, 'users', authenticatedUser.email?.toLowerCase() || '');
                unsubscribe = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        console.log('Fetched role:', data.role);
                        setRole(data.role || 'default');
                        setConfirmed(data.confirmed ?? false);
                    } else {
                        setRole('default');
                        setConfirmed(false);
                        console.log('No user document found. Default role set.');
                    }
                });
            } else {
                setRole(null);
                setConfirmed(null);
            }

            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, role, setRole, confirmed, setConfirmed }}>
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

export const useRoleFlags = () => {
    const { role } = useAuth();
    return {
        isTeacher: role === 'teacher',
        isAdmin: role === 'administrator',
    };
};