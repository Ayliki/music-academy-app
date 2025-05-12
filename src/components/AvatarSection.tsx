import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProfilePictureComponent from './ProfilePicture';
import { UserProfile } from '../services/userService';

interface AvatarSectionProps {
    profile: UserProfile;
    isTeacher: boolean;
    onPhotoOptions: () => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ profile, isTeacher, onPhotoOptions }) => {
    return (
        <View style={styles.avatarContainer}>

            <TouchableOpacity onPress={onPhotoOptions}>
                <ProfilePictureComponent
                    key={profile.profilePicture}
                    profilePicture={profile.profilePicture}
                />
            </TouchableOpacity>
            <Text style={styles.userName}>
                {profile.lastName} {profile.firstName}
            </Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
        </View>
    );
};

export default AvatarSection;

const styles = StyleSheet.create({
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    userName: {
        fontSize: 22,
        fontWeight: '600',
        color: '#444',
        marginTop: 8,
    },
    userEmail: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
        textDecorationLine: 'underline',
    },
});