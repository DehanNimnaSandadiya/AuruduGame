import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoI8ZulK6vQyZRxx6c_cSk34ko1xTGqbw",
  authDomain: "aurudu-leaderboard.firebaseapp.com",
  projectId: "aurudu-leaderboard",
  storageBucket: "aurudu-leaderboard.firebasestorage.app",
  messagingSenderId: "37462999758",
  appId: "1:37462999758:web:d5eb177b94bea9ba28069f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
