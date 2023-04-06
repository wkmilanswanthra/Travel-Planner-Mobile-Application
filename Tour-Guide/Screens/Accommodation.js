import React, {useContext, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Pressable} from 'react-native';
import {LocalizationContext} from "../Constants/i18n";
import {auth, store} from "../Config/firebaseConfig";
import {getDocs, collection} from 'firebase/firestore'
import {useEffect} from "react";


const Accommodation = ({props, title, setData, data, selection}) => {
    const {navigation, setModalVisible, setModalTitle, setModalDescription, setModalImg} = props

    function handlePress(item) {
        setModalTitle(item.data.name)
        let description='';
        description += item.data.address;
        if (item.data.rating)
            description+= '\nRating: '+item.data.rating;
        if (item.data.star)
            description+= '\nStar rating: '+item.data.star+ ' stars';
        if (item.data.web)
            description+= '\nWebsite: '+item.data.web;
        description+='\n Phone: '+item.data.phone
        setModalDescription(description)
        setModalImg(item.data.img)
        setModalVisible(true)
    }

    function handleLongPress(item) {
        console.log(item);
        (selection !== item) ? setData(item) : setData(undefined);
        console.log(selection);
    }

    return (
        <View style={styles.accoContainer}>
            {(title !== "") && <Text style={styles.title}>{title}</Text>}
            <ScrollView horizontal={true}>
                {data && data.map((item, index) => {
                    return (
                        <TouchableOpacity style={[styles.item, (selection === item && styles.selectedItem)]} key={index}
                                          onPress={() => handlePress(item)}
                                          onLongPress={() => handleLongPress(item)} activeOpacity={0.6}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.data.name}</Text>
                            <Image source={{uri: item.data.img}} style={styles.image}/>
                            <Text style={styles.itemDescription} numberOfLines={3}>{item.data.description}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
};

const AccommodationScreen = ({navigation, route}) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [modalImg, setModalImg] = useState('');
    const [hotelList, setHotelList] = useState('');
    const [restaurantList, setRestaurantList] = useState('');
    const [breakfast, setBreakfast] = useState(undefined);
    const [lunch, setLunch] = useState(undefined);
    const [dinner, setDinner] = useState(undefined);
    const [hotel, setHotel] = useState(undefined);
    const plan = route.params.plan
    const locations = route.params.locations
    const {i18n} = useContext(LocalizationContext)

    async function getHotels() {
        const snapshot = await getDocs(collection(store, 'hotels'));
        let hotels = [];
        snapshot.forEach(doc=>{
            hotels.push({id: doc.id, data: doc.data()});
        })
        setHotelList(hotels);
    }
    async function getRestaurants() {
        const snapshot = await getDocs(collection(store, 'restaurants'));
        let restaurants = [];
        snapshot.forEach(doc=>{
            restaurants.push({id: doc.id, data: doc.data()});
        })
        setRestaurantList(restaurants);
    }

    useEffect(()=>{
        if (auth.currentUser) {
            getHotels();
            getRestaurants();
        }
    },[])

    function getRandomSet(arr, num) {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }

    const props = {
        navigation,
        setModalVisible,
        setModalTitle,
        setModalDescription,
        setModalImg,
    }

    function handlePress() {
        if (!breakfast || !lunch || !dinner || !hotel){
            alert('Select one option for each category')
            return
        }
        const choi = {
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner,
            hotel: hotel
        }
        navigation.navigate('Route', {accommodation: choi, plan: plan, locations: locations})
    }

    return (
        <>
            <Text style={[styles.title, {marginTop: 20, marginLeft: 10}]}>{i18n.t('AccommodationTitle')}</Text>
            <ScrollView style={styles.container}>
                <Text style={styles.categoryTitle}>{i18n.t('AccommodationRestaurants')}</Text>
                <Accommodation title={i18n.t('AccommodationBreakfast')} props={props} selection={breakfast} setData={setBreakfast} data={restaurantList}/>
                <Accommodation title={i18n.t('AccommodationLunch')} props={props} selection={lunch} setData={setLunch} data={restaurantList}/>
                <Accommodation title={i18n.t('AccommodationDinner')} props={props} selection={dinner} setData={setDinner} data={restaurantList}/>
                <Text style={styles.categoryTitle}>{i18n.t('Hotels')}</Text>
                <Accommodation title="" props={props} selection={hotel} setData={setHotel} data={hotelList}/>
                <View style={{
                    width: '100%',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    paddingVertical: 20
                }}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText} onPress={handlePress}>{i18n.t('AccommodationConfirmSelection')}</Text>
                    </TouchableOpacity>
                </View>
                <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
                            <Text style={styles.modalText}>{modalDescription}</Text>
                            <Image source={{uri: modalImg}} style={styles.image}/>
                            <Pressable
                                style={[styles.buttonModal, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textStyle}>{i18n.t('AccommodationModalOk')}</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
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
    },
    accoContainer: {
        padding: 10,
    },
    categoryTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'left',
        marginTop: 20
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
        padding: 35,
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
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        width: '100%',
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
        textAlign: 'center',
        fontWeight: "600"
    }, modalTitle: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: "600"
    },
    selectedItem: {
        backgroundColor: '#b9b9b9'
    },
    button: {
        width: '80%',
        backgroundColor: '#333',
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }

});

export default AccommodationScreen;
