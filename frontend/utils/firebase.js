// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "creatoros-8c9dd.firebaseapp.com",
  projectId: "creatoros-8c9dd",
  storageBucket: "creatoros-8c9dd.appspot.com",
  messagingSenderId: "971795557081",
  appId: "1:971795557081:web:56584db408de0cdc1b2cc8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth  = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}