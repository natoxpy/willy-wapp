// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

import "firebase/firestore";
import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCfITEtRmuZPejnM9AdfDxVVZYlEDO50xI",
    authDomain: "thisprobablyaintgoingforproduc.firebaseapp.com",
    projectId: "thisprobablyaintgoingforproduc",
    storageBucket: "thisprobablyaintgoingforproduc.appspot.com",
    messagingSenderId: "776551581131",
    appId: "1:776551581131:web:455c700f52ceaa87cfa24e",
    measurementId: "G-9NRJPTQ7DY",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
