import React, {useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {LocalizationContext} from '../Constants/i18n';
import {useContext, useEffect} from "react";
import {Picker} from "@react-native-picker/picker";
import {auth, store} from "../Config/firebaseConfig";
import {collection, setDoc, doc, getDoc} from "firebase/firestore";


const ScreenWithLanguageSelector = ({navigation}) => {
    console.log('Homepage user: ', auth.currentUser?.email)

    const [language, setLanguage] = useState('');

    const {i18n, setLocal} = useContext(LocalizationContext);

    useEffect( () => {
        async function func() {
            if (auth.currentUser?.email) {
                const docRef = doc(store, 'users', auth.currentUser?.uid, 'routes', auth.currentUser?.uid );
                await getDoc(docRef).then(r => {
                    if (docRef) {
                        console.log('r: ', r.data().route)
                        navigation.navigate('Route', {accommodation: r.data().route.accommodation, plan: r.data().route.plan, locations: r.data().route.locations})
                    }
                })
            }
        }

        func()
    },[])

    function changeLanguage(lang) {
        i18n.locale = lang
        setLocal(lang)
        setLanguage(lang)
    }

    return (
        <View style={styles.container}>
            <Image source={{uri: 'https://static.vecteezy.com/system/resources/previews/011/003/356/original/cute-travel-icon-free-png.png'}} style={{height: 200, width: '50%'}}></Image>
            <Text style={styles.title}>{i18n.t('HomeTitle')}</Text>
            <Text style={styles.text}>{i18n.t('HomeSubTitle')}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    prompt={i18n.t('HomeSelectLang')}
                    selectedValue={language}
                    onValueChange={(itemValue, itemIndex) => changeLanguage(itemValue)}>
                    <Picker.Item label="English" value="en"/>
                    <Picker.Item label="French" value="fr"/>
                    <Picker.Item label="Spanish" value="es"/>
                    <Picker.Item label="German" value="de"/>
                    <Picker.Item label="Russian" value="ru"/>
                    <Picker.Item label="Italian" value="it"/>
                </Picker>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('PlanTrip')}}>
                <Text style={styles.buttonText}>{i18n.t('HomeProceedButton')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        marginTop: 16,
    },
    pickerContainer: {
        width: "50%",
        marginTop: 10,
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
    }

});

export default ScreenWithLanguageSelector;
