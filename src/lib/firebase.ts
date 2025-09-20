import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ3va2TXWkWli1j4fHiO_DuPDlzSth3FY",
  authDomain: "verivot-23d3b.firebaseapp.com",
  projectId: "verivot-23d3b",
  storageBucket: "verivot-23d3b.firebasestorage.app",
  messagingSenderId: "113048594555",
  appId: "1:113048594555:web:8937fb2cb8029f0eb95ade",
  measurementId: "G-K8H54XY3Q9"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
