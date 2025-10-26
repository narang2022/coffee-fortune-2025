// src/config.ts

// FIX: Import global types to make `ImportMetaEnv` available within this module.
import './types';

// This module reads environment variables using Vite's `import.meta.env` object.
// It centralizes all external service configurations.
// For this to work, create a `.env` file in the root directory for local development,
// and set the same variables in your Netlify deployment settings.

// Example `.env` file:
// VITE_FIREBASE_API_KEY="your-key"
// VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
// ...
// VITE_GA4_MEASUREMENT_ID="G-XXXXXXXXXX"

// Add a fallback for `import.meta.env` to prevent crashes in environments where it's not defined.
// FIX: Cast the empty object fallback to `Partial<ImportMetaEnv>` to resolve TypeScript errors about missing properties on type `{}`.
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {} as Partial<ImportMetaEnv>;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const ga4MeasurementId = env.VITE_GA4_MEASUREMENT_ID;

// Boolean flags to easily check if services are configured
export const isFirebaseEnabled = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.databaseURL &&
  firebaseConfig.projectId
);

export const isGa4Enabled = !!ga4MeasurementId;