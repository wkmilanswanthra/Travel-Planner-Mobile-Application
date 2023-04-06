import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, Pressable, Modal} from 'react-native';
import {LocalizationContext} from "../Constants/i18n";
import {auth, store} from "../Config/firebaseConfig";
import {collection, getDocs} from 'firebase/firestore'


const Suggestion = ({title, data, navigation, item, props}) => {


    const {setPlan, setModalTitle, setModalDescription, setModalVisible} = props

    function handlePress(item) {
        setModalTitle(item.title)
        let description="Locations visited, \n";
        let totTime = 0;
        for (const data of item.data){
            description+=data.data.name+' - '+data.data.time+' hours'+'\n'
            totTime+=data.data.time;
        }
        description+='\n\n'+'Total time: '+totTime+' hours'
        setModalDescription(description)
        setPlan(item.data)
        setModalVisible(true)
    }

    return (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.planContainer} activeOpacity={1}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView horizontal={true}>
                {data.map((item, index) => (
                    <View style={styles.item} key={index}>
                        <Text style={styles.itemTitle} numberOfLines={1}>{item.data.name}</Text>
                        <Image source={{uri: item.data.img}} style={styles.image}/>
                        <Text style={styles.itemDescription} numberOfLines={3}>{item.data.description}</Text>
                    </View>
                ))}
            </ScrollView>
        </TouchableOpacity>
    )
};

const SuggestionsScreen = ({navigation, route}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [plan, setPlan] = useState({});
    const tripPlan = route.params?.tripPlan;
    const {i18n} = useContext(LocalizationContext)
    const [locations, setLocations] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    let SUGGESTIONS = [];

    async function getLocations() {
        const querySnapshot = await getDocs(collection(store, "locations"));
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({id: doc.id, data: doc.data()})
        });
        setLocations(documents)
        return querySnapshot;
    }

    useEffect(()=>{
        if (auth.currentUser) {
            getLocations().then(()=>{

            })
        }else {

        }

    },[])

    useEffect(()=>{
        SUGGESTIONS = [
            {title: 'Package 1', data: getRandomSet(locations, 5)},
            {title: 'Package 2', data: getRandomSet(locations, 5)},
            {title: 'Package 3', data: getRandomSet(locations, 5)},
            {title: 'Package 4', data: getRandomSet(locations, 5)},
        ]
        setSuggestions(SUGGESTIONS)
    },[locations])

    function getRandomSet(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    const props = {
        setPlan, setModalTitle, setModalDescription, setModalVisible
    }

    return (
        <>
            <Text style={[styles.title, {marginTop: 20, marginLeft: 10}]}>{i18n.t('SuggestionsSelectAPlan')}</Text>
            <ScrollView style={styles.container}>
                {suggestions.map((item, index) => {
                    return (
                        <Suggestion title={item.title} data={item.data} navigation={navigation} key={index}
                                    item={item} props={props}/>
                    )
                })}

                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle} >{modalTitle}</Text>
                            <Text style={styles.modalText}>{modalDescription}</Text>
                            {/*<Image source={{uri: modalImg}} style={styles.image}/>*/}
                            <View style={{flexDirection: 'row'}}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                    <Text style={styles.textStyle}>{i18n.t('SuggestionsModalCancel')}</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        navigation.navigate('Accommodation', {locations: plan, plan: tripPlan})
                                    }}>
                                    <Text style={styles.textStyle}>{i18n.t('SuggestionsModalOK')}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    )
        ;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        alignItems: 'center',
        justifyContent: "center",
        width: 125,
        marginRight: 10,
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 20,
        elevation: 2
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 20
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    itemDescription: {
        fontSize: 12,
        textAlign: 'center',
    }, planContainer: {
        padding: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        width: '80%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        minWidth: '30%',
        marginHorizontal: 20,
        padding: 10,
        paddingHorizontal: 20,
        marginTop: 30,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#333333',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        fontWeight: "600"
    }, modalTitle: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: "600"
    },

});

export default SuggestionsScreen;
