import React, {useContext, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Alert, Pressable, Modal} from 'react-native';
import {LocalizationContext} from "../Constants/i18n";

const DATA = [
    {id: 1, title: 'Item 1', description: 'This is item 1', image: 'https://picsum.photos/200/300'},
    {id: 2, title: 'Item 2', description: 'This is item 2', image: 'https://picsum.photos/200/300'},
    {id: 3, title: 'Item 3', description: 'This is item 3', image: 'https://picsum.photos/200/300'},
    {id: 4, title: 'Item 4', description: 'This is item 4', image: 'https://picsum.photos/200/300'},
    {id: 5, title: 'Item 5', description: 'This is item 5', image: 'https://picsum.photos/200/300'},
    {id: 6, title: 'Item 6', description: 'This is item 6', image: 'https://picsum.photos/200/300'},
    {id: 7, title: 'Item 7', description: 'This is item 7', image: 'https://picsum.photos/200/300'},
    {id: 8, title: 'Item 8', description: 'This is item 8', image: 'https://picsum.photos/200/300'},
    {id: 9, title: 'Item 9', description: 'This is item 9', image: 'https://picsum.photos/200/300'},
    {id: 10, title: 'Item 10', description: 'This is item 10', image: 'https://picsum.photos/200/300'},
];

const SUGGESTIONS = [
    {title: 'Plan 1', data: DATA},
    {title: 'Plan 2', data: DATA},
    {title: 'Plan 3', data: DATA},
    {title: 'Plan 4', data: DATA},
]

const Suggestion = ({title, data, navigation, item, props}) => {

    const {setPlan, setModalTitle, setModalDescription, setModalVisible} = props

    function handlePress(item) {
        setModalTitle(item.title)
        setModalDescription(item.title)
        setPlan(item)
        setModalVisible(true)
    }

    return (
        <TouchableOpacity onPress={() => handlePress(item)} style={styles.planContainer} activeOpacity={1}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView horizontal={true}>
                {data.map(item => (
                    <View style={styles.item} key={item.id}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Image source={{uri: item.image}} style={styles.image}/>
                        <Text style={styles.itemDescription}>{item.description}</Text>
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
    const tripPlan = route.params.tripPlan;
    const {i18n} = useContext(LocalizationContext)

    const props = {
        setPlan, setModalTitle, setModalDescription, setModalVisible
    }

    return (
        <>
            <Text style={[styles.title, {marginTop: 20, marginLeft: 10}]}>{i18n.t('SuggestionsSelectAPlan')}</Text>
            <ScrollView style={styles.container}>
                {SUGGESTIONS.map((item, index) => {
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
                            <Text style={styles.modalTitle}>{modalTitle}</Text>
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
                                        navigation.navigate('Accommodation', {plan: plan})
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
        textAlign: 'center',
    }, modalTitle: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: "600"
    },

});

export default SuggestionsScreen;
