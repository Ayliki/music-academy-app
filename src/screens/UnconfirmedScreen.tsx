import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnconfirmedScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>
                Ваша учетная запись еще не подтверждена. Пожалуйста, дождитесь подтверждения администратора.
            </Text>
        </View>
    );
};

export default UnconfirmedScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 18,
        textAlign: 'center',
    },
});
