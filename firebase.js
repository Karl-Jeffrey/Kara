// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7JcD4ZvfGE16gdH5qgHBPfJvxHouDrwQ",
  authDomain: "kara-ac8b6.firebaseapp.com",
  projectId: "kara-ac8b6",
  storageBucket: "kara-ac8b6.appspot.com",
  messagingSenderId: "128110989835",
  appId: "1:128110989835:web:16339307ae31b9b521ed0e",
  measurementId: "G-W26CJF93PV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase instances
export const firestore = getFirestore(app); // Firestore instance
export const auth = getAuth(app); // Auth instance
