import React, {useContext, useState} from "react";
import {StyleSheet, View, TextInput, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {LocalizationContext} from "../Constants/i18n";


export default function Login({navigation, route}) {

    const {i18n} = useContext(LocalizationContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = () => {
        if ((validateEmail() & validatePassword()) && route.params) {
            console.log('login: ', email, ' ', password)
            navigation.replace('Suggestions', {tripPlan: route.params.tripPlan});
        } else if ((validateEmail() & validatePassword())) {
            navigation.replace('PlanTrip')
        }
    };

    const validateEmail = () => {
        if (email === '') {
            setEmailError(i18n.t('LoginErrorEmailReq'));
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError(i18n.t('LoginErrorInvalidEmail'));
            return false;
        } else {
            setEmailError('');
            return true
        }
    };

    const validatePassword = () => {
        if (password === '') {
            setPasswordError(i18n.t('LoginPasswordReq'));
            return false;
        } else if (password.length < 6) {
            setPasswordError(i18n.t('LoginPassChar'));
            return false;
        } else {
            setPasswordError('');
            return true
        }
    };


    function goToRegister() {
        navigation.navigate('Register')
    }

    return (<View style={styles.container}>
        <View style={styles.inputContainer}>
            <Icon name='email' type='material' color='#666' size={24}/>
            <TextInput
                style={styles.input}
                placeholder={i18n.t('LoginEmail')}
                value={email}
                onChangeText={setEmail}
                onBlur={validateEmail}
                keyboardType={'email-address'}
            />
        </View>
        <Text style={styles.errorText}>{emailError}</Text>
        <View style={styles.inputContainer}>
            <Icon name='lock' type='material' color='#666' size={24}/>
            <TextInput
                style={styles.input}
                placeholder={i18n.t('LoginPassword')}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                onBlur={validatePassword}
            />
        </View>
        <Text style={styles.errorText}>{passwordError}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{i18n.t('LoginBtn')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop: 20}} onPress={goToRegister}>
            <Text>{i18n.t('LoginRegister')}</Text>
        </TouchableOpacity>
    </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        borderColor: '#ccc',
        width: '80%',
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        color: '#333',
        fontSize: 15,
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
        marginLeft: '10%',
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
})
