import React, {useContext, useEffect, useState} from 'react'
import {Dimensions, Text, View, StyleSheet, TouchableOpacity, Alert, Pressable, Modal} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import axios from "axios";
import {constants} from "../Constants/constants";
import {LocalizationContext} from "../Constants/i18n";


export default function Route({navigation, routeData}) {

    const [modalVisible, setModalVisible] = useState(false);
    const [fetchedData, setFetchedData] = useState({});
    const [modalTitle, setModalTitle] = useState('');
    const [modalDescription, setModalDescription] = useState('');
    const {i18n} = useContext(LocalizationContext)



    const [location, setLocation] = useState({
        latitude: 6.055976621306367,
        longitude: 80.21603097108284,
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0121,
    })

    const marker = [
        {
            title: 'location 1',
            location: {
                latitude: 6.026335258400748,
                longitude: 80.2176625787385

            },
            description: 'skjdf',
            img: 'https://www.picsum.photos/200/200'
        },
        {
            title: 'location 1',
            location: {
                latitude: 6.042552725147913,
                longitude: 80.19465995581676,
            },
            description: 'skjdf',
            img: 'https://www.picsum.photos/200/200'
        },
        {
            title: 'location 1',
            location: {
                latitude: 6.011312330495717,
                longitude: 80.24873328581938
            },
            description: 'skjdf',
            img: 'https://www.picsum.photos/200/200'
        },
    ]

    const data = JSON.stringify({
        'origin': {
            'location': {
                'latLng': {
                    'latitude': 6.026335258400748,
                    'longitude': 80.2176625787385
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
        },
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
    })

    console.log(fetchedData)

    const getRouteData = () => {
        console.log(constants.GOOGLE_API_KEY)
        const config = {
            method: 'post',
            url: 'https://routes.googleapis.com/directions/v2:computeRoutes',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': 'AIzaSyDq5lN5q408J4qNlmKhAFLSqIQgP4X8G3Q',
                'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
            },
            data: data
        };

        axios(config).then((response) => {
            setFetchedData(response.data)
        }).catch((e) => {
            console.error(e.message)
        });
    }

    useEffect(() => {
        getRouteData()
    }, [])

    const showLocation = () => {
        return marker.map((item, index) => {
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

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.maps}
                initialRegion={location}>
                {showLocation()}
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
                        <Text style={styles.modalTitle}>Sample</Text>
                        <Text style={styles.modalText}>Sample</Text>
                        {/*<Image source={{uri: modalImg}} style={styles.image}/>*/}
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.textStyle}>{i18n.t('RouteModalDone')}</Text>
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