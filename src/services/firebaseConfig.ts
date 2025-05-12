import {
    initializeApp,
    getApp,
    getApps,
    FirebaseApp
} from 'firebase/app';
import {
    Auth,
    getAuth
} from 'firebase/auth';
import {
    getReactNativePersistence,
} from 'firebase/auth/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from '@env';
import {getStorage, FirebaseStorage} from "firebase/storage";

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let storage: FirebaseStorage;

if (!getApps().length) {
    console.log("API ключ", firebaseConfig.apiKey);
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
    storage = getStorage(
        app,
        'gs://music-academy-75552.firebasestorage.app',
    );
} else {
    app = getApp();
    auth = getAuth(app);
    storage = getStorage(
        app,
        'gs://music-academy-75552.firebasestorage.app',
    );
}


export {auth, app, storage};
export const db = getFirestore(app);
