import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import bcrypt from "bcrypt"
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoer1qseG9TDol2wJod8reni9rmO5YpIc",
  authDomain: "qms-single-queue.firebaseapp.com",
  projectId: "qms-single-queue",
  storageBucket: "qms-single-queue.appspot.com",
  messagingSenderId: "481495834378",
  appId: "1:481495834378:web:e745bd382925dc60b5e4f3",
  measurementId: "G-HELQVX3EN7"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// Function to submit data to Firestore
const submitDataToFirestore = async (collectionName, data) => {
  try {
    data.date = serverTimestamp();
    const docRef = await addDoc(collection(db, collectionName), data);
    // console.log("Data submitted successfully with ID: ", docRef.id);
    return docRef.id; // Return the generated ID
  } catch (error) {
    console.error("Error submitting data: ", error);
    throw error; // Re-throw the error to handle it at the caller level
  }
};



const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
    const isAdmin = email === "admin@tecnavis.com";
    const isCounter = email.endsWith("@tecnavis.com");

    if (isAdmin) {
      return "admin";
    } else if (isCounter) {
      return "counter";
    } else {
      throw new Error("Invalid input");
    }
};

const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("Logout Successful");
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};
export { auth, db, submitDataToFirestore, signIn, signOutUser };
