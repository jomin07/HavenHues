// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "havenhues-c5127.firebaseapp.com",
  projectId: "havenhues-c5127",
  storageBucket: "havenhues-c5127.appspot.com",
  messagingSenderId: "1079446060407",
  appId: "1:1079446060407:web:0f0aa2c50c9e7a5378f572"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);