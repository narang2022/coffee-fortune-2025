/// <reference types="react" />

// FIX: Import React to use its types within the global JSX namespace definition.
import React from 'react';

export enum Language {
  KO = 'KO',
  EN = 'EN',
}

export interface FortuneData {
  id: number;
  text: string;
  luckyColor: string;
  luckyColorHex: string;
  luckyNumber: number;
  luckyPlace: string;
}

export interface MenuItem {
  id: number;
  image: string;
  name: { [key in Language]: string };
  description: { [key in Language]: string };
}

export interface Translations {
  [key: string]: { [key in Language]: string };
}

// FIX: Add TypeScript definitions for the 'lottie-player' custom element to be recognized in JSX.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // FIX: Simplified the type definition for the 'lottie-player' custom element.
      // Removing `React.DetailedHTMLProps` can resolve subtle typing issues with custom web components in a React environment.
      'lottie-player': React.HTMLAttributes<HTMLElement> & {
        src: string;
        background: string;
        speed: string;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }

  // FIX: Add type definition for Vite's `import.meta.env`.
  interface ImportMetaEnv {
    readonly VITE_FIREBASE_API_KEY: string | undefined;
    readonly VITE_FIREBASE_AUTH_DOMAIN: string | undefined;
    readonly VITE_FIREBASE_DATABASE_URL: string | undefined;
    readonly VITE_FIREBASE_PROJECT_ID: string | undefined;
    readonly VITE_FIREBASE_STORAGE_BUCKET: string | undefined;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string | undefined;
    readonly VITE_FIREBASE_APP_ID: string | undefined;
    readonly VITE_GA4_MEASUREMENT_ID: string | undefined;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}