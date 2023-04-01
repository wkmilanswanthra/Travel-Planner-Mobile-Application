import React, {useContext, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert, Pressable} from 'react-native';
import {LocalizationContext} from "../Constants/i18n";

const DATA = [
    {id: 1, category: 'dinner', title: 'Item 1', description: 'This is item 1', image: 'https://picsum.photos/200/300'},
    {id: 2, category: 'dinner', title: 'Item 2', description: 'This is item 2', image: 'https://picsum.photos/200/300'},
    {id: 3, category: 'dinner', title: 'Item 3', description: 'This is item 3', image: 'https://picsum.photos/200/300'},
    {id: 4, category: 'dinner', title: 'Item 4', description: 'This is item 4', image: 'https://picsum.photos/200/300'},
    {id: 5, category: 'dinner', title: 'Item 5', description: 'This is item 5', image: 'https://picsum.photos/200/300'},
    {id: 6, category: 'dinner', title: 'Item 6', description: 'This is item 6', image: 'https://picsum.photos/200/300'},
    {id: 7, category: 'dinner', title: 'Item 7', description: 'This is item 7', image: 'https://picsum.photos/200/300'},
    {id: 8, category: 'dinner', title: 'Item 8', description: 'This is item 8', image: 'https://picsum.photos/200/300'},
    {id: 9, category: 'dinner', title: 'Item 9', description: 'This is item 9', image: 'https://picsum.photos/200/300'},
    {
        id: 10,
        category: 'dinner',
        title: 'Item 10',
        description: 'This is item 10',
        image: 'https://picsum.photos/200/300'
    },
];


const Accommodation = ({props, title, setData, data}) => {
    const {DATA, navigation, setModalVisible, setModalTitle, setModalDescription, setModalImg, setChoice} = props

    function handlePress(item) {
        setModalTitle(item.title)
        setModalDescription(item.description)
        setModalImg(item.image)
        setModalVisible(true)
    }

    function handleLongPress(item) {
        (data !== item) ? setData(item) : setData('')
    }

    return (
        <View style={styles.accoContainer}>
            {(title !== "") && <Text style={styles.title}>{title}</Text>}
            <ScrollView horizontal={true}>
                {DATA.map((item, index) => {
                    return (
                        <TouchableOpacity style={[styles.item, (data === item && styles.selectedItem)]} key={index}
                                          onPress={() => handlePress(item)}
                                          onLongPress={() => handleLongPress(item)} activeOpacity={0.6}>
                            <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                            <Image source={{uri: item.image}} style={styles.image}/>
                            <Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text>
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
    const [choice, setChoice] = useState({});
    const [breakfast, setBreakfast] = useState('');
    const [lunch, setLunch] = useState('');
    const [dinner, setDinner] = useState('');
    const [hotel, setHotel] = useState('');
    const plan = route.params.plan
    const {i18n} = useContext(LocalizationContext)

    console.log(plan)

    const props = {
        DATA,
        navigation,
        setModalVisible,
        setModalTitle,
        setModalDescription,
        setModalImg,
        choice,
        setChoice
    }

    function handlePress() {
        navigation.navigate('Route')
    }

    return (
        <>
            <Text style={[styles.title, {marginTop: 20, marginLeft: 10}]}>{i18n.t('AccommodationTitle')}</Text>
            <ScrollView style={styles.container}>
                <Text style={styles.categoryTitle}>{i18n.t('AccommodationRestaurants')}</Text>
                <Accommodation title={i18n.t('AccommodationBreakfast')} props={props} setData={setBreakfast} data={breakfast}/>
                <Accommodation title={i18n.t('AccommodationLunch')} props={props} setData={setLunch} data={lunch}/>
                <Accommodation title={i18n.t('AccommodationDinner')} props={props} setData={setDinner} data={dinner}/>
                <Text style={styles.categoryTitle}>{i18n.t('Hotels')}</Text>
                <Accommodation title="" props={props} setData={setHotel} data={hotel}/>
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
