import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "electoral-awards.firebaseapp.com",
    projectId: "electoral-awards",
    storageBucket: "electoral-awards.appspot.com",
    messagingSenderId: "901302182914",
    appId: "1:901302182914:web:355429def74a1c2019b31b",
    measurementId: "G-2QCK54FHEY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Firestore
// const db = getFirestore(app)

// export { auth, app } 