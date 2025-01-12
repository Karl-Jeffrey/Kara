import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7JcD4ZvfGE16gdH5qgHBPfJvxHouDrwQ",
  authDomain: "kara-ac8b6.firebaseapp.com",
  projectId: "kara-ac8b6",
  storageBucket: "kara-ac8b6.firebasestorage.app",
  messagingSenderId: "128110989835",
  appId: "1:128110989835:web:16339307ae31b9b521ed0e",
  measurementId: "G-W26CJF93PV"
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firestore and Storage instances
export const db = getFirestore(app); 
console.log("Firestore initialized:", db);
export const storage = getStorage(app); 
export default app;
