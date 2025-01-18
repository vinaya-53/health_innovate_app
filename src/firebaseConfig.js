// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbYPdpXjxd60IxWAaHCoOqJoY-x2CdnEs",
  authDomain: "innovative-app-e381a.firebaseapp.com",
  projectId: "innovative-app-e381a",
  storageBucket: "innovative-app-e381a.firebasestorage.app",
  messagingSenderId: "363965283817",
  appId: "1:363965283817:web:a77e8cf555fae8f1169f78",
  measurementId: "G-WWNJ4Q34KW"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { app,auth, db };


//bedtimestories5322@gmail.com
//bedtimes12345