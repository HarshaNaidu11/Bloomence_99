// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEP6wrpURMbAtq7INx5mbAL0txz4ftPdA",
  authDomain: "ai-edu-93fe3.firebaseapp.com",
  projectId: "ai-edu-93fe3",
  storageBucket: "ai-edu-93fe3.firebasestorage.app",
  messagingSenderId: "631409150460",
  appId: "1:631409150460:web:804b3d1b08f772ca00ca79",
  measurementId: "G-MQCJMQZZ6S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
