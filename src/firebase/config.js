// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnU4pXtdgTiDlo2ZzOAA3K0mUyqH0kUMs",
  authDomain: "study-planner-ai-88aa7.firebaseapp.com",
  projectId: "study-planner-ai-88aa7",
  storageBucket: "study-planner-ai-88aa7.firebasestorage.app",
  messagingSenderId: "76187477136",
  appId: "1:76187477136:web:5bb9ff25744674f12ea415",
  measurementId: "G-NYZ9MD8RLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Export them
export { app, analytics, db };