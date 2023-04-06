import React, {useContext, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {LocalizationContext} from "../Constants/i18n";
import {signOut} from 'firebase/auth'
import {auth} from "../Config/firebaseConfig";
import {onAuthStateChanged} from 'firebase/auth'

const AuthOptions = ({navigation, route}) => {

    console.log('AuthOptions user: ', auth.currentUser?.email)

    const {i18n, local, setLocal} = useContext(LocalizationContext);


    const handleLogin = () => {
        if (route.params)
            navigation.replace('Login', {tripPlan: route.params.tripPlan});
        else
            navigation.replace('Login');

    };

    const handleSignUp = () => {
        navigation.navigate('Register');
    };

    const handleLogout = () => {
        // handle logout logic
        signOut(auth).then(u => {
            navigation.replace('Home')
        })
    };

    return (
        <View style={styles.container}>
            {!auth.currentUser && <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{i18n.t('AuthLogin')}</Text>
            </TouchableOpacity>}
            {!auth.currentUser && <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>{i18n.t('AuthSignUp')}</Text>
            </TouchableOpacity>}
            {auth.currentUser && <Text> Current User  : {auth.currentUser?.email}</Text>}
            {auth.currentUser && <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>{i18n.t('AuthLogOut')}</Text>
            </TouchableOpacity>}
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
