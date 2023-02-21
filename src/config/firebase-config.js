import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBORMYT2KWStX88dGvNi6RRZqg8bHH4N6M",
  authDomain: "medicationassistant-c0df1.firebaseapp.com",
  projectId: "medicationassistant-c0df1",
  storageBucket: "medicationassistant-c0df1.appspot.com",
  messagingSenderId: "626908369898",
  appId: "1:626908369898:web:f2a0b3256a76f8934a9893"
};


const app = initializeApp(firebaseConfig);

export const auth=getAuth(app)
export const provider = new GoogleAuthProvider()
export const db=getFirestore(app)