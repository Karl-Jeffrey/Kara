import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
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

// Firestore utility functions
export const getPosts = async () => {
  try {
    const postsCollection = collection(firestore, "posts");
    const snapshot = await getDocs(postsCollection);
    const postsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postsList; // Return posts data
  } catch (error) {
    console.error("Error fetching posts: ", error);
    throw error;
  }
};

export const addPost = async (newPost) => {
  try {
    const postsCollection = collection(firestore, "posts");
    const docRef = await addDoc(postsCollection, newPost);
    console.log("Post added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding post: ", error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const postDoc = doc(firestore, "posts", postId);
    await deleteDoc(postDoc);
    console.log("Post deleted with ID: ", postId);
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};
