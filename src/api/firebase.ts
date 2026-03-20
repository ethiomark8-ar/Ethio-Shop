import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAX71SMkQZs9qHAkb-reSgARhDFWx-TAjI",
  authDomain: "ethioshop-2253.firebaseapp.com",
  projectId: "ethioshop-2253",
  storageBucket: "ethioshop-2253.firebasestorage.app",
  messagingSenderId: "763760280606",
  appId: "1:763760280606:web:6d4249d4c3b27da26e5a0f",
  measurementId: "G-ZYBER6S1Q1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
