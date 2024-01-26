
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage'
import { getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyBdqu3oN5hFhuZqebQv9rMpRFApqC3PmTo",
  authDomain: "chatapp-9ce16.firebaseapp.com",
  projectId: "chatapp-9ce16",
  storageBucket: "chatapp-9ce16.appspot.com",
  messagingSenderId: "981503434919",
  appId: "1:981503434919:web:3c275441aa4923c99efb82"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
