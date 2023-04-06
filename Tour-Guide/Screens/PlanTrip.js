import React, {useState, useContext, useRef, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Platform, KeyboardAvoidingView} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";
import {LocalizationContext} from '../Constants/i18n';
import {Picker} from '@react-native-picker/picker';
import {auth} from "../Config/firebaseConfig";
import {onAuthStateChanged} from 'firebase/auth'
import {useIsFocused} from "@react-navigation/native";

let datePickerShown = false;

const PlanTripScreen = ({navigation}) => {
    console.log('Plan Trip user: ', auth.currentUser?.email)


    const options = ["Galle", "Matara", "Colombo", "Kandy", "Nuwara Eliya", "Matale", "Jafna"];
    const [destination, setDestination] = useState('');
    const [numPeople, setNumPeople] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [transportation, setTransportation] = useState('public');
    const [planningTime, setPlanningTime] = useState('');
    const [show, setShow] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const {i18n} = useContext(LocalizationContext);

    const handleNext = () => {
        console.log(auth.currentUser?.uid)
        if (!destination.trim()) {
            Alert.alert(i18n.t('IndexAlertDest'));
            return;
        }
        if (!numPeople.trim() || isNaN(Number(numPeople)) || Number(numPeople) <= 0) {
            Alert.alert(i18n.t('IndexAlertNumPpl'));
            return;
        }
        if (!datePickerShown) {
            Alert.alert(i18n.t('IndexAlertDates'));
            return;
        }
        if (!planningTime.trim() || isNaN(Number(planningTime)) || Number(planningTime) <= 0) {
            Alert.alert(i18n.t('IndexAlertPlanTime'));
            return;
        }


        const tripPlan = {
            destination: destination,
            numPeople: numPeople,
            startDate: startDate.toDateString(),
            endDate: endDate.toDateString(),
            transportation: transportation,
            planningTime: planningTime
        }

        // navigate to next screen
        if (auth.currentUser) {
            navigation.navigate('Suggestions', {tripPlan: tripPlan});
        }else {
            navigation.navigate('AuthOptions', {tripPlan: tripPlan});

        }
    };


    const handleQueryChange = (text) => {
        setQuery(text);
        if (text) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionPress = (suggestion) => {
        setQuery(suggestion);
        setDestination(suggestion)
        setShowSuggestions(false);
    };

    const renderSuggestion = ({item}) => (
        <TouchableOpacity style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
            <Text>{item}</Text>
        </TouchableOpacity>);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        datePickerShown = true
        setShow(false);
        setStartDate(currentDate);
        (endDate < currentDate) ? setEndDate(currentDate) : false;
    };
    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate;
        datePickerShown = true
        setShowEnd(false);
        setEndDate(currentDate);
    };


    const modePickerRef = useRef();

    function open() {
        modePickerRef.current.focus();
    }

    function close() {
        modePickerRef.current.blur();
    }

    const langPickerRef = useRef();

    function open() {
        langPickerRef.current.focus();
    }

    function close() {
        langPickerRef.current.blur();
    }

    // if (!isAuthenticated) {
    //     navigation.navigate('SignIn');
    //     return null;
    // }

    function goToAuth() {
        navigation.navigate('AuthOptions');
    }


    return (<KeyboardAvoidingView style={styles.container}>
        <View style={styles.header}>
            <View style={styles.searchBarContainer}><TextInput
                style={styles.searchBar}
                placeholder={i18n.t('IndexSearch')}
                placeholderTextColor="#666"
                onChangeText={handleQueryChange}
                value={query}
            />
                {showSuggestions && (<FlatList
                    data={options.filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))}
                    renderItem={renderSuggestion}
                    keyExtractor={(item) => item}
                    style={styles.suggestionsContainer}
                />)}</View>
            <TouchableOpacity onPress={goToAuth}>
                <IonIcon name="person-circle-outline" size={40} color={'black'}/>
            </TouchableOpacity>
        </View>
        {!showSuggestions &&
            <>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{i18n.t('IndexTitle')}</Text>
                    {/*{!user && <Text>Please sign in to plan your tour</Text>}*/}
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('IndexDestination')}
                        value={destination}
                        onChangeText={setDestination}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('IndexNumberOfPPl')}
                        keyboardType="numeric"
                        value={numPeople}
                        onChangeText={setNumPeople}
                    />
                    <View style={[styles.selectorsContainer]}>
                        <TextInput
                            style={[styles.input, styles.selector, {}]}
                            placeholder={i18n.t('IndexStartDest')}
                        />
                        <TouchableOpacity style={[styles.input, styles.selector, styles.mode]}>
                            <Picker
                                ref={modePickerRef}
                                prompt={i18n.t('IndexTransMode')}
                                selectedValue={transportation}
                                onValueChange={(itemValue, itemIndex) => setTransportation(itemValue)}>
                                <Picker.Item label={i18n.t('IndexModePublic')} value="public"/>
                                <Picker.Item label={i18n.t('IndexModePrivate')} value="private"/>
                            </Picker>
                        </TouchableOpacity>


                    </View>
                    <View style={styles.datePickersContainer}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 80,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <TouchableOpacity style={styles.datePicker} onPress={() => {
                                setShow(!show)
                                datePickerShown = true;
                            }}>
                                <Text style={{
                                    borderWidth: ((Platform.OS === 'ios') ? 0 : 1),
                                    padding: ((Platform.OS === 'ios') ? 0 : 5),
                                    marginHorizontal: ((Platform.OS === 'ios') ? 0 : 10),
                                    textAlign: ((Platform.OS === 'ios') ? 'left' : 'center'),
                                    borderRadius: 20,
                                    borderColor: '#ccc'
                                }}>
                                    {(!(startDate && (Platform.OS === 'android') && datePickerShown)) ? i18n.t('IndexStartDate') : startDate.toDateString()}
                                </Text>
                            </TouchableOpacity>
                            {(show || (Platform.OS === 'ios')) && <DateTimePicker
                                testID="dateTimePicker"
                                value={startDate}
                                mode={'date'}
                                onChange={onChange}
                                minimumDate={new Date()}
                            />}
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            height: 80,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                            <TouchableOpacity style={styles.datePicker} onPress={() => {
                                setShowEnd(!show)
                                datePickerShown = true;
                            }}>
                                <Text style={{
                                    borderWidth: ((Platform.OS === 'ios') ? 0 : 1),
                                    padding: ((Platform.OS === 'ios') ? 0 : 5),
                                    marginHorizontal: ((Platform.OS === 'ios') ? 0 : 10),
                                    textAlign: ((Platform.OS === 'ios') ? 'left' : 'center'),
                                    borderRadius: 20,
                                    borderColor: '#ccc'
                                }}>
                                    {(!(endDate && (Platform.OS === 'android') && datePickerShown)) ? i18n.t('IndexEndDate') : endDate.toDateString()}
                                </Text>
                            </TouchableOpacity>
                            {(showEnd || (Platform.OS === 'ios')) && <DateTimePicker
                                testID="dateTimePicker"
                                value={endDate}
                                mode={'date'}
                                onChange={onChangeEnd}
                                minimumDate={startDate}
                            />}
                        </View>

                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('IndexPlanTime')}
                        value={planningTime}
                        onChangeText={setPlanningTime}
                        keyboardType={"name-phone-pad"}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>{i18n.t('IndexNextBtn')}</Text>
                    </TouchableOpacity>
                </View>
            </>}
    </KeyboardAvoidingView>);
};

const styles = StyleSheet.create({
    container: {
        height: '100%', backgroundColor: '#ffffff', paddingHorizontal: 20, paddingTop: 50,
    }, header: {
        height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20,
    }, searchBar: {
        flex: 1, height: 40, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 20, fontSize: 16,
    }, titleContainer: {
        marginTop: 50, alignItems: 'center', marginBottom: 30,
    }, title: {
        fontSize: 24, fontWeight: 'bold', marginBottom: 10,
    }, formContainer: {
        marginBottom: 30,
    }, input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginBottom: 15,
        justifyContent: "center"
    }, selectorsContainer: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginVertical: 30
    }, selector: {
        flex: 1, marginRight: 10,
    }, datePickersContainer: {
        flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20,
    }, datePicker: {
        flex: 1, marginRight: 10,
        borderRadius: 20,
        width: '100%'
    }, button: {
        height: 40, backgroundColor: '#333', borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    }, buttonText: {
        color: '#fff', fontSize: 16, fontWeight: 'bold',
    }, suggestionsContainer: {
        position: "absolute",
        top: 50,
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderColor: '#ccc',
        borderWidth: 1,
    }, suggestion: {
        paddingVertical: 10, paddingHorizontal: 10, borderBottomColor: '#ccc', borderBottomWidth: 1,
    }, searchBarContainer: {
        flex: 0.8, height: 40, flexDirection: "column"
    },
    mode: {
        borderWidth: ((Platform.OS === 'ios') ? 0 : 2)
    }


})

export default PlanTripScreen;
