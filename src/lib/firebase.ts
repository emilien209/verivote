import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAN95KDrL7_VbM6DA5jnanYYHXZLLDi6NQ",
  authDomain: "tora-b66a1.firebaseapp.com",
  projectId: "tora-b66a1",
  storageBucket: "tora-b66a1.appspot.com",
  messagingSenderId: "474621598483",
  appId: "1:474621598483:web:864347e5d5e570d179d8e6",
  measurementId: "G-GX4G4LNMVG"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
