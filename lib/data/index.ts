import { DataSource } from './types';
import { firebaseSource } from './firebase';
import { mockSource as localSource } from './mock';
import { hasFirebaseClientConfig } from '../firebase/client';

const hasFullFirebaseEnv =
  hasFirebaseClientConfig &&
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export const dataSource: DataSource = hasFullFirebaseEnv ? firebaseSource : localSource;
