// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBO2e9HBU11oM7RsxWGZtrtFsLKW_971iM",
    authDomain: "my-libretto.firebaseapp.com",
    projectId: "my-libretto",
    storageBucket: "my-libretto.firebasestorage.app",
    messagingSenderId: "687246205179",
    appId: "1:687246205179:web:318b63bc154d780d62d05e"
};

// Inizializza l'app di Firebase
const app = initializeApp(firebaseConfig);

// Esporta le istanze dei servizi che useremo
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
