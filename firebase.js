// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcpDnXFGr5Ntm3N3_J7J-FdMYyPbYkVZs",
  authDomain: "tinderapp-17e2b.firebaseapp.com",
  projectId: "tinderapp-17e2b",
  storageBucket: "tinderapp-17e2b.appspot.com",
  messagingSenderId: "118998147594",
  appId: "1:118998147594:web:a69b6ae6a38c19122df5f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db};