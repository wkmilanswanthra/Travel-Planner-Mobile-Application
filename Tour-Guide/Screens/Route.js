import React, {useContext, useEffect, useRef, useState} from 'react'
import {Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Pressable, Modal} from "react-native";
import MapView,{Marker, PROVIDER_GOOGLE, Polyline} from "react-native-maps";
import axios from "axios";
import {constants} from "../Constants/constants";
import {LocalizationContext} from "../Constants/i18n";
import * as Location from 'expo-location';
import * as pol from "@mapbox/polyline";
import {auth, store} from "../Config/firebaseConfig";
import {addDoc, collection, setDoc, doc} from "firebase/firestore";

export default function Route({navigation, routeData, route}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [fetchedData, setFetchedData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const [markers, setMarkers] = useState([]);
    const {i18n} = useContext(LocalizationContext);
    const mapRef = useRef(null);
    const [location, setLocation] = useState({
        latitude: 6.055976621306367,
        longitude: 80.21603097108284,
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0121,
    })
    const [time, setTime] = useState(0);


    const getRouteData = (data) => {
        console.log(constants.GOOGLE_API_KEY)
        const config = {
            method: 'post',
            url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': 'Add you google maps API key here',
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
            },
            data: JSON.stringify(data)
        };

        axios(config).then((response) => {
            console.log(response.data)
            let points = pol.decode(response.data.routes[0].polyline.encodedPolyline);
            let coords = points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                }
            })
            setFetchedData(coords)
        }).catch((e) => {
            console.error(e.message)
        });
    }

    useEffect(() => {
        async function setup() {
            let {status} = await Location.requestForegroundPermissionsAsync();
            console.log(status)
            if (status !== 'granted') {
                alert('Please grant location permissions')
                return;
            }

            await Location.watchPositionAsync({
                    enableHighAccuracy: true,
                    distanceInterval: 1,
                    timeInterval: 30000
                }, p => {
                    console.log(p)
                    // if (location) {
                        // if (p) {
                        //     mapRef.current.animateToRegion({
                        //         ...location,
                        //         latitude: p.coords.latitude,
                        //         longitude: p.coords.longitude
                        //     }, 1000)
                        // }
                        setLocation({...location, latitude: p.coords.latitude, longitude: p.coords.longitude})
                    // }
                },
                (err) => {
                    console.log(err)
                });

        }
        setup()

        if (route.params){
            let x =[];
            let description = '';
            for (const loc of route.params.locations){
                x.push({
                    title: loc.data.name,
                    location: {
                        latitude: loc.data.location.latitude,
                        longitude: loc.data.location.longitude

                    },
                    description: loc.data.description,
                    img: loc.data.img
                })
            }
            x.push({
                title: route.params.accommodation.hotel.data.name,
                location: {
                    latitude: route.params.accommodation.hotel.data.location.latitude,
                    longitude: route.params.accommodation.hotel.data.location.longitude

                },
                description: route.params.accommodation.hotel.data.description,
                img: route.params.accommodation.hotel.data.img
            })
            x.push({
                title: route.params.accommodation.breakfast.data.name,
                location: {
                    latitude: route.params.accommodation.breakfast.data.location.latitude,
                    longitude: route.params.accommodation.breakfast.data.location.longitude

                },
                description: route.params.accommodation.breakfast.data.description,
                img: route.params.accommodation.breakfast.data.img
            })
            x.push({
                title: route.params.accommodation.lunch.data.name,
                location: {
                    latitude: route.params.accommodation.lunch.data.location.latitude,
                    longitude: route.params.accommodation.lunch.data.location.longitude

                },
                description: route.params.accommodation.lunch.data.description,
                img: route.params.accommodation.lunch.data.img
            })
            x.push({
                title: route.params.accommodation.dinner.data.name,
                location: {
                    latitude: route.params.accommodation.dinner.data.location.latitude,
                    longitude: route.params.accommodation.dinner.data.location.longitude

                },
                description: route.params.accommodation.dinner.data.description,
                img: route.params.accommodation.dinner.data.img
            })
            description+= 'Locations of interest\n\n'
            let totTime = 0;
            for (const loc of route.params.locations){
                description += loc.data.name+' - '+ loc.data.time + ' hours' + ' \n '
                totTime += loc.data.time
            }
            description+= '\nTotal time - '+ totTime + ' hours'
            description+= '\n\nTonight\'s stay\n'
            description += route.params.accommodation.hotel.data.name
            description+= '\n\nBreakfast at\n'
            description += route.params.accommodation.breakfast.data.name
            description+= '\n\nLunch at\n'
            description += route.params.accommodation.lunch.data.name
            description+= '\n\nDinner at\n'
            description += route.params.accommodation.dinner.data.name
            setModalDescription(description)
            setMarkers(x)
        }

        if (auth.currentUser) {
            setDoc(doc(store, "users", auth.currentUser.uid, "routes", auth.currentUser.uid ), {
                route: route.params,
                date: new Date()
            }).then(r => {
                console.log(r)
            }).catch(e => {
                console.error(e.message)
            })
        }

    }, [])


    useEffect(() => {
        mapRef.current.animateToRegion(location, 1000)
        const data = {
            'origin': {
                'location': {
                    'latLng': {
                        'latitude': location.latitude,
                        'longitude': location.longitude
                    }
                }
            },
            'destination': {
                'location': {
                    'latLng': {
                        'latitude': 6.011312330495717,
                        'longitude': 80.24873328581938
                    }
                }
            },"intermediates": [],
            'travelMode': 'DRIVE',
            'routingPreference': 'TRAFFIC_AWARE',
            'departureTime': '2023-10-15T15:01:23.045123456Z',
            'computeAlternativeRoutes': false,
            'routeModifiers': {
                'avoidTolls': false,
                'avoidHighways': false,
                'avoidFerries': false
            },
            'languageCode': 'en-US',
            'units': 'IMPERIAL'
        }

        if (route.params) {
            data.intermediates.push({
                "location":{
                    "latLng":{
                        "latitude": route.params.accommodation.breakfast.data.location.latitude,
                        "longitude": route.params.accommodation.breakfast.data.location.longitude
                    }
                }
            })
            data.intermediates.push({
                "location":{
                    "latLng":{
                        "latitude": route.params.accommodation.lunch.data.location.latitude,
                        "longitude": route.params.accommodation.lunch.data.location.longitude
                    }
                }
            })
            data.intermediates.push({
                "location":{
                    "latLng":{
                        "latitude": route.params.accommodation.dinner.data.location.latitude,
                        "longitude": route.params.accommodation.dinner.data.location.longitude
                    }
                }
            })
            data.intermediates.push({
                "location":{
                    "latLng":{
                        "latitude": route.params.accommodation.hotel.data.location.latitude,
                        "longitude": route.params.accommodation.hotel.data.location.longitude
                    }
                }
            })
            for (let i = 0; i < route.params.locations.length; i++) {
                if (i!==(route.params.length-1))
                    data.intermediates.push({
                        "location":{
                            "latLng":{
                                "latitude": route.params.locations[i].data.location.latitude,
                                "longitude": route.params.locations[i].data.location.longitude
                            }
                        }
                    })
                else {
                    data.destination.location.latLng.latitude = route.params.locations[i].data.location.latitude
                    data.destination.location.latLng.longitude = route.params.locations[i].data.location.longitude
                }
            }
        }
        getRouteData(data)
    }, [location])

    const showLocation = () => {
        return markers.map((item, index) => {
            return (
                <Marker
                    key={index}
                    coordinate={item.location}
                    title={item.title}
                    description={item.description}
                />
            )
        })
    }

    function showRoute() {
        return (
            <Polyline
                coordinates={fetchedData}
                strokeWidth={6}
                strokeColor="red"/>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.maps}
                initialRegion={location}
                showsUserLocation={true}>
                {(markers!==[]) && showLocation()}
                {fetchedData && showRoute()}
            </MapView>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>{i18n.t('RouteBtn')}</Text>
                </TouchableOpacity>
            </View>
            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Route information</Text>
                        <Text style={styles.modalText}>{modalDescription}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.textStyle}>{i18n.t('RouteModalDone')}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose, {marginTop: 10, backgroundColor: '#912929'}]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                navigation.navigate('Rate', {data: route.params})
                            }}>
                            <Text style={styles.textStyle}>End Trip</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    maps: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }, button: {
        width: '80%',
        backgroundColor: '#333',
        borderRadius: 20,
        padding: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }, btnContainer: {
        position: "absolute",
        width: '100%',
        bottom: 0,
        alignContent: "center",
        alignItems: "center",
        paddingVertical: 20
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
    buttonClose: {
        backgroundColor: '#333333',
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});