import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ProfilePictureComponent from './ProfilePicture';
import { UserProfile } from '../services/userService';

interface ProfileSummaryProps {
    profile: UserProfile;
    onPress: () => void;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile, onPress }) => {
    const fullName = `${profile.lastName} ${profile.firstName}`;

    let containerBackgroundColor = '#D6DCF1';
    if (profile.role === 'teacher') {
        containerBackgroundColor = '#314FBB';
    } else if (profile.role === 'administrator') {
        containerBackgroundColor = '#4DD3BA';
    }

    let textColor = '#000';
    if (profile.role === 'teacher' || profile.role === 'administrator') {
        textColor = '#fff';
    }

    return (
        <TouchableOpacity style={[styles.profileContainer, , { backgroundColor: containerBackgroundColor }]} onPress={onPress}>
            <ProfilePictureComponent
                key={profile.profilePicture}
                profilePicture={profile.profilePicture}
                sizeMultiplier={0.25}
            />
            <View style={styles.profileTextContainer}>
                <Text style={[styles.profileName, { color: textColor }]}>{fullName}</Text>
                <Text style={[styles.profileEmail, { color: textColor }]}>{profile.email}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ProfileSummary;

const styles = StyleSheet.create({
    profileContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        padding: 16,
        marginHorizontal: '5%',
        marginVertical: 12,
    },
    profileTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 25.2,
        color: '#000',
    },
    profileEmail: {
        fontSize: 15,
        color: '#555',
        textDecorationLine: 'underline',
        marginTop: 2,
    },
});
