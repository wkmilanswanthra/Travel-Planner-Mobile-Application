import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {LocalizationContext} from "../Constants/i18n";

const AuthOptions = ({ navigation, route}) => {

    const { i18n, local, setLocal } = useContext(LocalizationContext);


    const handleLogin = () => {
        if (route.params)
            navigation.navigate('Login', {tripPlan: route.params.tripPlan});
        else
            navigation.navigate('Login');

    };

    const handleSignUp = () => {
        navigation.navigate('Register');
    };

    const handleLogout = () => {
        // handle logout logic
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{i18n.t('AuthLogin')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>{i18n.t('AuthSignUp')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>{i18n.t('AuthLogOut')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    button: {
        width: '80%',
        backgroundColor: '#333',
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AuthOptions;
