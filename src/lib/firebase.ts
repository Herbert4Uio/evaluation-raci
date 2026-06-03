import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This will be populated by firebase-applet-config.json once setup is complete
let firebaseConfig: any = {};
try {
  // @ts-ignore
  const configModule = await import(/* @vite-ignore */ '../../firebase-applet-config.json');
  firebaseConfig = configModule.default || configModule;
} catch (e) {
  // Config file not found, will rely on environment variables or fallback
}

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const finalConfig = {
  ...firebaseConfig,
  ...(envConfig.apiKey ? { apiKey: envConfig.apiKey } : {}),
  ...(envConfig.authDomain ? { authDomain: envConfig.authDomain } : {}),
  ...(envConfig.projectId ? { projectId: envConfig.projectId } : {}),
  ...(envConfig.storageBucket ? { storageBucket: envConfig.storageBucket } : {}),
  ...(envConfig.messagingSenderId ? { messagingSenderId: envConfig.messagingSenderId } : {}),
  ...(envConfig.appId ? { appId: envConfig.appId } : {}),
};

export const isFirebaseEnabled = !!(finalConfig.apiKey && finalConfig.projectId);

let app: any = null;
export let auth: any = null;
export let db: any = null;

if (isFirebaseEnabled) {
  try {
    app = initializeApp(finalConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase: ', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Running in Offline/Demo mode using localStorage.');
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
