// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig

if (process.env.NODE_ENV === 'test') {
  firebaseConfig = {
    apiKey: 'dummy_api_key',
    authDomain: 'dummy_auth_domain',
    projectId: 'chaintree-development',
    storageBucket: 'dummy_storage_bucket',
    messagingSenderId: 'dummy_sender_id',
    appId: 'dummy_app_id',
    measurementId: 'dummy_measurement_id',
  }
} else {
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy_api_key',
    authDomain: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-development') + '.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-development',
    storageBucket: (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'chaintree-development') + '.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || 'dummy_sender_id',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'dummy_app_id',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'dummy_measurement_id',
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
// const analytics = getAnalytics(app);

export { auth, app, db, storage }
