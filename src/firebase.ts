// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF1sV0PW1EVIVJeeWuDhrdqQEAgSk3DfI",
  authDomain: "mulch-checklist.firebaseapp.com",
  projectId: "mulch-checklist",
  storageBucket: "mulch-checklist.firebasestorage.app",
  messagingSenderId: "298346768185",
  appId: "1:298346768185:web:8fb0ef07fa0238b2fe6ae8",
  measurementId: "G-F30CGP52NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };