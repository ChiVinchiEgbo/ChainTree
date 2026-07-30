import { DataSource } from './types';
import { firebaseSource } from './firebase';
import { mockSource } from './mock';
import { hasFirebaseClientConfig } from '../firebase/client';

const hasFullFirebaseEnv =
  hasFirebaseClientConfig &&
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!hasFullFirebaseEnv) {
  console.log('[v0] falling back to mock data');
}

export const dataSource: DataSource = hasFullFirebaseEnv ? firebaseSource : mockSource;
