import {StatusBar} from 'expo-status-bar';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Home from "./Screens/Home";
import PlanTrip from './Screens/PlanTrip'
import AuthOptions from './Screens/AuthOptions'
import Login from './Screens/Login'
import Register from './Screens/Register'
import Suggestions from './Screens/Suggestions'
import Accommodation from './Screens/Accommodation'
import Route from "./Screens/Route";
import Rate from "./Screens/Rate";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LocalizationProvider from "./Constants/i18n";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto"/>
            <LocalizationProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName={'Home'}>
                        <Stack.Screen name="Home" component={Home} options={{title: 'Welcome'}}/>
                        <Stack.Screen name="PlanTrip" component={PlanTrip} options={{title: 'Plan your trip'}}/>
                        <Stack.Screen name="AuthOptions" component={AuthOptions} options={{title: 'Become a member'}} />
                        <Stack.Screen name="Login" component={Login}/>
                        <Stack.Screen name="Register" component={Register}/>
                        <Stack.Screen name="Suggestions" component={Suggestions} options={{title: 'Available plans'}}/>
                        <Stack.Screen name="Accommodation" component={Accommodation}/>
                        <Stack.Screen name="Route" component={Route} options={{title: 'Map'}}/>
                        <Stack.Screen name="Rate" component={Rate} options={{title: 'Rate your visited locations'}}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </LocalizationProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
});
