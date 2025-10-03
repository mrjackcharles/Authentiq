// Client-side Firebase SDK initialization for Next.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration (public)
// These values are safe to include in client code
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB5KqGoB1GPb4Isf53GriRcmLvKYhjHZOk",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "authentiqdb1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "authentiqdb1",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "authentiqdb1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "934270486555",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:934270486555:web:a56c04c9d2368d041c90be",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FYKFE6C1Y3",
};

// Initialize app once
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

// Analytics only works in the browser and when supported
export async function initAnalytics() {
  if (typeof window === "undefined") return null;
  try {
    const supported = await isSupported();
    return supported ? getAnalytics(firebaseApp) : null;
  } catch (_) {
    return null;
  }
}
