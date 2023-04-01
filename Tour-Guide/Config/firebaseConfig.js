import * as firebase from 'firebase/app';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDVvwcCkTbpjMKvfs24JGGG5tmLhfzCdjI",
    authDomain: "tour-guide-df334.firebaseapp.com",
    projectId: "tour-guide-df334",
    storageBucket: "tour-guide-df334.appspot.com",
    messagingSenderId: "61652512086",
    appId: "1:61652512086:web:55ae29d4424b995d12baf7"
};

const app = firebase.initializeApp(firebaseConfig)
const auth = getAuth(app)


export {app, auth}