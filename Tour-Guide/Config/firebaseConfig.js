import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    //Add your firebase config data here
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const store = getFirestore(app)


export {app, auth, store}