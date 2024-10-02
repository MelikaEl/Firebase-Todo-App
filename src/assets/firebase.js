// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC_bmDaaDMDTo2n3CLLWZot35TCIdDTzA",
  authDomain: "todo-app-51e51.firebaseapp.com",
  projectId: "todo-app-51e51",
  storageBucket: "todo-app-51e51.appspot.com",
  messagingSenderId: "954407779071",
  appId: "1:954407779071:web:47e84578bed2af4fb42aca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);