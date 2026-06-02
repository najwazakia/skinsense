// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB8w02Pviu_z0zG4nx5gakGsXm9jSExgMY',
  authDomain: 'skin-disease-detection-b2dc0.firebaseapp.com',
  projectId: 'skin-disease-detection-b2dc0',
  storageBucket: 'skin-disease-detection-b2dc0.firebasestorage.app',
  messagingSenderId: '14637274585',
  appId: '1:14637274585:web:6b9112a970a0bc190335c8',
  measurementId: 'G-ZKWVZD5025',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ekspor instance Auth dan Provider untuk dipakai di halaman login
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();