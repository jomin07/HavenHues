import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "havenhues-c5127.firebaseapp.com",
  projectId: "havenhues-c5127",
  storageBucket: "havenhues-c5127.appspot.com",
  messagingSenderId: "1079446060407",
  appId: "1:1079446060407:web:0f0aa2c50c9e7a5378f572",
};

export const app = initializeApp(firebaseConfig);
