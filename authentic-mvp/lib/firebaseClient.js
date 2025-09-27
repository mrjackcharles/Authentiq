// Client-side Firebase SDK initialization for Next.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration (public)
// These values are safe to include in client code
const firebaseConfig = {
  apiKey: "AIzaSyB5KqGoB1GPb4Isf53GriRcmLvKYhjHZOk",
  authDomain: "authentiqdb1.firebaseapp.com",
  projectId: "authentiqdb1",
  storageBucket: "authentiqdb1.firebasestorage.app",
  messagingSenderId: "934270486555",
  appId: "1:934270486555:web:a56c04c9d2368d041c90be",
  measurementId: "G-FYKFE6C1Y3",
};

// Initialize app once
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

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

