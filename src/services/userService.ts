import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export interface UserProfile {
    lastName: string;
    firstName: string;
    middleName?: string;
    phone?: string;
    email?: string;
    profilePicture?: string;
    role?: "teacher" | "administrator" | "default";
    groupId?: string;
    subjectId?: string;
}

export const updateUserProfile = async (values: UserProfile): Promise<void> => {
    if (!auth.currentUser?.email) {
        throw new Error('User not authenticated');
    }
    const docRef = doc(db, 'users', auth.currentUser.email.toLowerCase());
    const dataToUpdate: Partial<UserProfile> = {};

    if (values.lastName !== undefined) dataToUpdate.lastName = values.lastName;
    if (values.firstName !== undefined) dataToUpdate.firstName = values.firstName;
    if (values.middleName !== undefined) dataToUpdate.middleName = values.middleName;
    if (values.phone !== undefined) dataToUpdate.phone = values.phone;
    if (values.profilePicture !== undefined) dataToUpdate.profilePicture = values.profilePicture;
    if (values.groupId !== undefined) dataToUpdate.groupId = values.groupId;
    if (values.subjectId !== undefined) dataToUpdate.subjectId = values.subjectId;

    await updateDoc(docRef, dataToUpdate);
};
