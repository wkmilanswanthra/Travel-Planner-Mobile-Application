import React, {useContext, useState} from 'react';
import {auth} from '../Config/firebaseConfig'
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {LocalizationContext} from '../Constants/i18n';

const SignUpScreen = ({navigation}) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [passport, setPassport] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const {i18n} = useContext(LocalizationContext)

    const handleSignUp = () => {
        // Validation logic
        if (!fullName || !email || !passport || !contactNo || !password) {
            setError(i18n.t('RegisterErrorAllFields'));
            return;
        }

        if (!validateEmail(email)) {
            setError(i18n.t('RegisterErrorValidEmail'));
            return;
        }

        if (!validatePassport(passport)) {
            setError(i18n.t('RegisterErrorValidNIC'));
            return;
        }

        if (!validateContactNo(contactNo)) {
            setError(i18n.t('RegisterErrorContact'));
            return;
        }

        if (!validatePassword(password)) {
            setError(i18n.t('RegisterErrorValidPassword'));
            return;
        }
        setError('')

        // Submit form logic
        console.log('Submitting form...', {
            fullName,
            email,
            passport,
            contactNo,
            password,
        });

        auth.createUserWithEmailAndPassword(email, password)
            .then(user=>{
                console.log('Registered user: ', user)
            })
            .catch(error=>{
                console.error(error)
            })
    };

    const validateEmail = (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    };

    const validatePassport = (passport) => {
        return passport;
    };

    const validateContactNo = (contactNo) => {
        const regex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
        return regex.test(contactNo);
    };

    const validatePassword = (password) => {
        return password;
    };

    function goToLogin() {
        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('RegisterTitle')}</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder={i18n.t('RegisterFullName')}
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('RegisterEmail')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('RegisterPassNIC')}
                value={passport}
                onChangeText={setPassport}
                autoCapitalize="characters"
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('RegisterContact')}
                value={contactNo}
                onChangeText={setContactNo}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder={i18n.t('RegisterPassword')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>{i18n.t('RegisterSignUpBtn')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{marginTop: 20}} onPress={goToLogin}>
                <Text>{i18n.t('RegisterBackToLogin')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        borderColor: '#ccc',
        width: '80%',
        marginBottom: 20
    },
    button: {
        width:'80%',
        backgroundColor: '#333',
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
export default SignUpScreen;
