import firebase from "firebase/app"
import { getFirestore } from "@firebase/firestore"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.React_App_API_KEY,
    authDomain: "eng---ru-lexical-decision-task.firebaseapp.com",
    projectId: "eng---ru-lexical-decision-task",
    storageBucket: "eng---ru-lexical-decision-task.appspot.com",
    messagingSenderId: "539514076306",
    appId: "1:539514076306:web:02ed6563a38c308794ba4b",
    measurementId: "G-3LRZPHCTLV"
  };

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)