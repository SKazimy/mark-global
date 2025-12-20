import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Firebase configuration
// Note: These are safe to expose - Firebase uses security rules for protection
const firebaseConfig = {
  apiKey: "AIzaSyAnPDsTVHIWRh7BlJjHUh_ZQ71_L843lpA",
  authDomain: "markglobal-6b176.firebaseapp.com",
  projectId: "markglobal-6b176",
  storageBucket: "markglobal-6b176.firebasestorage.app",
  messagingSenderId: "104493303920",
  appId: "1:104493303920:web:abb9aa68231b9100df0cb5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Cloud Functions
export const functions = getFunctions(app);

export default app;
