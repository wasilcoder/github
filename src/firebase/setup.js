// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2rAcrEGQhSGklkWFFyTIYIoUALoNFTu0",
  authDomain: "jobberproj.firebaseapp.com",
  projectId: "jobberproj",
  storageBucket: "jobberproj.appspot.com",
  messagingSenderId: "731955321254",
  appId: "1:731955321254:web:6f260903c652f0b7129767",
  measurementId: "G-EXVF7RTEBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)


export default app;