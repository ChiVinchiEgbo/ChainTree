import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

let firebaseConfig

if (process.env.NODE_ENV === 'test') {
  firebaseConfig = {
    apiKey: 'dummy_api_key',
    authDomain: 'dummy_auth_domain',
    projectId: 'chaintree-d915a',
    storageBucket: 'dummy_storage_bucket',
    messagingSenderId: 'dummy_sender_id',
    appId: 'dummy_app_id',
    measurementId: 'dummy_measurement_id',
  }
} else {
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBg4NmcU5gkm41OPwGQpAsis_063ZwU5G8',
    authDomain: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a') + '.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a',
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-d915a') + '.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || '4723827185',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:4723827185:web:99b8f4de2634df6c506450',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-36V38HX81K',
  }
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

async function startEmulators() {
  if (!global['EMULATORS_STARTED']) {
    global['EMULATORS_STARTED'] = true
    try {
      await connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
      await connectFirestoreEmulator(db, 'localhost', 8080)
      await connectStorageEmulator(storage, 'localhost', 9199)
      console.log('Emulators connected successfully')
    } catch (error) {
      console.error('Error connecting to emulators:', error)
    }
  }
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  startEmulators().catch(console.error)
}

export { auth, app, db, storage }
