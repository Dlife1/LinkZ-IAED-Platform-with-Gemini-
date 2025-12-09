
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot, 
  Firestore, 
  DocumentSnapshot 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  Auth, 
  User 
} from 'firebase/auth';
import { ChatMessage, ContextData, UserProfile } from '../types';

// NOTE: In a real deployment, these would come from process.env
// For this demo generation, we use a placeholder config.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "demo-app.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "demo-app",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "demo-app.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

const isConfigured = process.env.FIREBASE_API_KEY !== undefined;

if (isConfigured && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase init error:", error);
  }
}

export const signIn = async (): Promise<User | null> => {
  if (!auth) return null;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
};

export const subscribeToSession = (
  userId: string, 
  callback: (data: { messages?: ChatMessage[], contextData?: ContextData }) => void
) => {
  if (!db) return () => {};
  
  const sessionRef = doc(db, `artifacts/linkz-v3/users/${userId}/sessions/active`);
  
  return onSnapshot(sessionRef, (docSnap: DocumentSnapshot) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as any);
    }
  });
};

export const saveSession = async (
  userId: string, 
  messages: ChatMessage[], 
  contextData: ContextData
) => {
  if (!db) return;
  const sessionRef = doc(db, `artifacts/linkz-v3/users/${userId}/sessions/active`);
  try {
    await setDoc(sessionRef, {
      messages,
      contextData,
      lastUpdated: Date.now()
    }, { merge: true });
  } catch (error) {
    console.error("Save error:", error);
  }
};

// --- User Profile Management ---

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  if (!db) return null;
  try {
    const profileRef = doc(db, `artifacts/linkz-v3/users/${userId}/profile/data`);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Get Profile Error:", error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
  if (!db) return;
  try {
    const profileRef = doc(db, `artifacts/linkz-v3/users/${userId}/profile/data`);
    await setDoc(profileRef, { ...data, uid: userId }, { merge: true });
  } catch (error) {
    console.error("Update Profile Error:", error);
  }
};
