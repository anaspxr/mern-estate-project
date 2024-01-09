// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-project-51f20.firebaseapp.com",
  projectId: "mern-estate-project-51f20",
  storageBucket: "mern-estate-project-51f20.appspot.com",
  messagingSenderId: "278921576149",
  appId: "1:278921576149:web:7dd8c36ddeaac7e180ac5c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);