// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-website-c92c3.firebaseapp.com",
  projectId: "blog-website-c92c3",
  storageBucket: "blog-website-c92c3.appspot.com",
  messagingSenderId: "762812315031",
  appId: "1:762812315031:web:1444c2f86531bb311a80d2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);