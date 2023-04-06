import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator} from 'react-native';
import {Card} from 'react-native-elements';
import {Rating} from 'react-native-ratings';
import {auth, store} from "../Config/firebaseConfig";
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'

const Rate = ({navigation, route}) => {
    const [data, setData] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let x =[];
        x.push({
            title: route.params.data.accommodation.hotel.data.name,
            img: route.params.data.accommodation.hotel.data.img,
            id: route.params.data.accommodation.hotel.id,
            cat: 'hotels'
        })
        if (!x.some(e => e.title === route.params.data.accommodation.breakfast.data.name )) {
            x.push({
                title: route.params.data.accommodation.breakfast.data.name,
                img: route.params.data.accommodation.breakfast.data.img,
                id: route.params.data.accommodation.breakfast.id,
                cat: 'restaurants'
            })
        }
        if (!x.some(e => e.title === route.params.data.accommodation.lunch.data.name )) {
            x.push({
                title: route.params.data.accommodation.lunch.data.name,
                img: route.params.data.accommodation.lunch.data.img,
                id: route.params.data.accommodation.lunch.id,
                cat: 'restaurants'
            })
        }
        if (!x.some(e => e.title === route.params.data.accommodation.dinner.data.name )) {
            x.push({
                title: route.params.data.accommodation.dinner.data.name,
                img: route.params.data.accommodation.dinner.data.img,
                id: route.params.data.accommodation.dinner.id,
                cat: 'restaurants'
            })
        }
        setData(x)
    }, [])

    const handleRating = (item, rating) => {
       let z = ratings;
       if (z.some(e => e.id === item.id)) {
           z.map((e) => {
               if (e.id === item.id) {
                   e.rating = rating;
               }
           })
       } else {
           z.push({
               id: item.id,
               rating: rating,
               cat: item.cat
           })
       }
         setRatings(z);
    };

    async function handlePress() {
        setIsLoading(true)
        console.log(ratings);
        for (const rate of ratings){
            const docRef = new doc(store, rate.cat, rate.id);
            let currentRate = (await getDoc(docRef)).data().rating;
            await setDoc(docRef, {
                rating: (rate.rating+currentRate)/2
            }, {merge: true}).then(() => {
                console.log('Document successfully written!');
            }).catch((error) => {
                console.error('Error writing document: ', error);
                setIsLoading(false)
            });
        }

        const docRef = new doc(store, 'users', auth.currentUser.uid, 'routes', auth.currentUser.uid);
        await deleteDoc(docRef).then(() => {
            console.log('Document successfully deleted!');
            navigation.navigate('Home');
            setIsLoading(false)
        }).catch((error) => {
            console.error('Error removing document: ', error);
            setIsLoading(false)
        });
    }

    return (
        <>
            <ScrollView>
                {data.map((item, i) => (
                    <View key={i}>
                        <Card containerStyle={styles.cardContainer} wrapperStyle={styles.cardWrapper}>
                            <View style={styles.container}>
                                <Card.Image source={{'uri': item.img}}
                                            style={{width: 100, height: 100, borderRadius: 20}}/>
                                <View style={styles.data}>
                                    <Card.Title style={{margin: 0}} >{item.title}</Card.Title>
                                    <Rating
                                        showRating
                                        onFinishRating={(rating) => handleRating(item, rating)}
                                        style={{paddingVertical: 10, fontSize: 20}}
                                        imageSize={25}
                                        startingValue={3}/>
                                </View>

                            </View>
                        </Card>
                    </View>
                ))}
            </ScrollView>
            <View style={{alignItems: 'center', padding: 15}}>
                <TouchableOpacity style={styles.button} onPress={handlePress}>
                    {isLoading && <ActivityIndicator size="small" color="white" />}
                    {!isLoading && <Text style={styles.buttonText}>Submit and End trip</Text>}
                </TouchableOpacity>
            </View>
        </>

    );
};

export default Rate;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 20,
    },
    cardWrapper: {},
    data: {
        marginLeft: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    container: {
        flexDirection: 'row',
        alignItems: "center",
        width: '100%',
        height: 150,
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
        fontSize: 18,
        fontWeight: 'bold',
    },

});
