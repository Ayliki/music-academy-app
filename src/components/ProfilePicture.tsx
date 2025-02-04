import React from 'react';
import { Image, View, StyleSheet, useWindowDimensions } from 'react-native';

interface ProfilePictureProps {
    profilePicture?: string;
    sizeMultiplier?: number;
}

const ProfilePictureComponent: React.FC<ProfilePictureProps> = ({ profilePicture, sizeMultiplier = 0.485, }) => {
    const { width } = useWindowDimensions();
    const avatarSize = width * sizeMultiplier;

    return (
        <View
            style={[
                styles.avatarContainer,
                {
                    width: avatarSize,
                    height: avatarSize,
                    borderRadius: avatarSize / 2,
                },
            ]}
        >
            <Image
                source={
                    profilePicture
                        ? { uri: profilePicture }
                        : require('../../assets/images/profile-picture.png')
                }
                style={styles.profileImage}
            />
        </View>
    );
};

export default ProfilePictureComponent;

const styles = StyleSheet.create({
    avatarContainer: {
        borderWidth: 2,
        borderColor: '#D3C1A5',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});