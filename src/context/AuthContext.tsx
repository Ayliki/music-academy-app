import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

type Role = 'default' | 'teacher' | 'administrator' | null;

interface AuthContextType {
    user: User | null;
    loading: boolean;
    role: Role;
    setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const useRoleFlags = () => {
    const { role } = useAuth();
    return {
        isTeacher: role === 'teacher',
        isAdmin: role === 'administrator',
    };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<Role>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
            setUser(authenticatedUser);
            setLoading(false);

            if (authenticatedUser) {
                try {
                    const userDocRef = doc(db, 'users', authenticatedUser.email?.toLowerCase() || '');
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setRole(data.role ?? 'default');
                    } else {
                        setRole('default');
                        console.log('No user document found. Default role set.');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setRole('default');
                }
            } else {
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, role, setRole }}>
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
