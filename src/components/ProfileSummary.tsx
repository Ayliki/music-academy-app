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
    return (
        <TouchableOpacity style={styles.profileContainer} onPress={onPress}>
            <ProfilePictureComponent profilePicture={profile.profilePicture} sizeMultiplier={0.25} />
            <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{fullName}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
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
        backgroundColor: '#D6DCF1',
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
