import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBg4NmcU5gkm41OPwGQpAsis_063ZwU5G8',
  authDomain: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a') + '.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a',
  storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a') + '.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || '4723827185',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:4723827185:web:99b8f4de2634df6c506450',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-36V38HX81K',
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, app, db, storage }
