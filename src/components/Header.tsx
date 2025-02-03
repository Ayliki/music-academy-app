// components/Header.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Header: React.FC = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
            <Image
                source={require('../../assets/images/AK-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 240,
        backgroundColor: '#fff',
    },
    circle1: {
        position: 'absolute',
        width: 445,
        height: 406,
        borderRadius: 203,
        top: -169,
        left: -35,
        backgroundColor: '#FFC600',
        opacity: 0.2,
    },
    circle2: {
        position: 'absolute',
        width: 342,
        height: 342,
        borderRadius: 171,
        top: -134,
        left: 209,
        backgroundColor: '#FFC600',
        opacity: 0.2,
    },
    logo: {
        position: 'absolute',
        width: 289,
        height: 121,
        top: 110,
        left: 53,
    },
});

export default Header;
