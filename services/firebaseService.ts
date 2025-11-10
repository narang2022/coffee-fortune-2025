import { firebaseConfig, isFirebaseEnabled } from '../config';

// FIX: Moved the global declaration to the top level of the file.
// An ambient module declaration is only allowed at the top level.
// This makes the type for `window.firebase` available and resolves the TypeScript errors.
declare global {
  interface Window {
    firebase: any;
  }
}

// --- Type Declarations ---
interface DailyStats {
  views: number;
  likes: number;
  dislikes: number;
}

// --- Mock Implementation (localStorage Fallback) ---
const getTodayDateString = () => {
  // KST is UTC+9. This method creates a KST date string in YYYY-MM-DD format
  // robustly, without relying on locale-specific formatting.
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const kstDate = new Date(utc + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getStoredStats = (): DailyStats => {
    try {
        const stored = localStorage.getItem(`coffee-fortune-stats-${getTodayDateString()}`);
        return stored ? JSON.parse(stored) : { views: 0, likes: 0, dislikes: 0 };
    } catch (error) {
        return { views: 0, likes: 0, dislikes: 0 };
    }
}

const setStoredStats = (stats: DailyStats) => {
    localStorage.setItem(`coffee-fortune-stats-${getTodayDateString()}`, JSON.stringify(stats));
}

// --- Firebase Singleton & Initialization ---
let databaseInstance: any = null;
let initializePromise: Promise<any | null> = null;

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
        return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(script);
  });
};

const getDatabase = (): Promise<any | null> => {
  if (!isFirebaseEnabled) {
    return Promise.resolve(null);
  }

  if (databaseInstance) {
    return Promise.resolve(databaseInstance);
  }

  if (!initializePromise) {
    initializePromise = new Promise(async (resolve, reject) => {
      try {
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
        await loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js');

        if (window.firebase && !window.firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        databaseInstance = window.firebase.database();
        console.log('[Firebase] Service initialized.');
        resolve(databaseInstance);
      } catch (error) {
        console.error("[Firebase] Initialization failed:", error);
        initializePromise = null; // Allow retrying
        reject(error);
      }
    });
  }
  return initializePromise;
};

// --- Public Service Functions ---

export const getTodayStats = async (): Promise<DailyStats> => {
  const db = await getDatabase();
  if (!db) {
    console.log('[Firebase Mock] Getting today\'s stats from localStorage.');
    return Promise.resolve(getStoredStats());
  }

  const date = getTodayDateString();
  const snapshot = await db.ref(`daily_stats/${date}`).get();
  return snapshot.val() || { views: 0, likes: 0, dislikes: 0 };
};

export const incrementViewCount = async (): Promise<number> => {
  const db = await getDatabase();
  if (!db) {
    console.log('[Firebase Mock] Incrementing view count in localStorage.');
    const stats = getStoredStats();
    stats.views += 1;
    setStoredStats(stats);
    return Promise.resolve(stats.views);
  }

  const date = getTodayDateString();
  const ref = db.ref(`daily_stats/${date}/views`);
  const transactionResult = await ref.transaction((currentValue: number | null) => (currentValue || 0) + 1);
  return transactionResult.snapshot.val() || 1;
};

export const recordFeedback = async (type: 'like' | 'dislike'): Promise<void> => {
  const db = await getDatabase();
  if (!db) {
    console.log(`[Firebase Mock] Recording feedback: ${type} in localStorage.`);
    const stats = getStoredStats();
    if (type === 'like') {
      stats.likes += 1;
    } else {
      stats.dislikes += 1;
    }
    setStoredStats(stats);
    return Promise.resolve();
  }
  
  const date = getTodayDateString();
  const refKey = type === 'like' ? 'likes' : 'dislikes';
  const ref = db.ref(`daily_stats/${date}/${refKey}`);
  await ref.transaction((currentValue: number | null) => (currentValue || 0) + 1);
};
