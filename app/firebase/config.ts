import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Read variables from .env.local file safely
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID //analytics
};

// Prevent initializing Firebase multiple times during Next.js local updates (hot-reloads)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Check if we are running in local development mode
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
  // Grab the local emulator address from your environment setups, default to port 8080
  const emulatorHost = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR_HOST || "localhost:8080";
  const [host, port] = emulatorHost.split(":");
  
  connectFirestoreEmulator(db, host, Number(port));
  console.log(`Connected to local Firestore Emulator at ${emulatorHost}`);
}

export { app, db };
