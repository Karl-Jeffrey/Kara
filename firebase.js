import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Firebase only if not already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const firestore = getFirestore(app);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth =
  !getApps().length
    ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth(app);
