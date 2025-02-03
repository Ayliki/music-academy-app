import React from 'react';
import {
    Modal,
    View,
    Image,
    StyleSheet,
    ActivityIndicator,
    Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
    visible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ visible }) => {
    return (
        <Modal visible={visible} transparent={false} animationType="fade">
            <View style={styles.container}>

                {/* TOP CIRCLES */}
                <Image
                    source={require('../../assets/images/top-circles.png')}
                    style={styles.topCircles}
                />

                {/* BOTTOM CIRCLES */}
                <Image
                    source={require('../../assets/images/bottom-circles.png')}
                    style={styles.bottomCircles}
                />

                {/* LOADING LOGO (centered) */}
                <Image
                    source={require('../../assets/images/loading-logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                {/* Optional spinner below the logo */}
                <ActivityIndicator size="large" color="#000" style={styles.spinner} />
            </View>
        </Modal>
    );
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topCircles: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: width * 1.2,
        height: height * 0.35,
        resizeMode: 'contain',
    },
    bottomCircles: {
        position: 'absolute',
        bottom: -height * 0.106,
        left: 0,
        width: width,
        height: height * 0.35,
        resizeMode: 'contain',
    },
    logo: {
        width: width * 0.64,
        height: width * 0.64,
    },
    spinner: {
        marginTop: 20,
    },
});
