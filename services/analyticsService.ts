import { ga4MeasurementId, isGa4Enabled } from '../config';

// FIX: Moved the global declaration to the top level of the file.
// An ambient module declaration is only allowed at the top level.
// This makes the types for `window.dataLayer` and `window.gtag` available and resolves the TypeScript errors.
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let isInitialized = false;

// This function dynamically injects the GA4 script tag into the document head.
// It's designed to run only once.
const initializeGa4 = () => {
  if (isInitialized || !isGa4Enabled) {
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // Set up the gtag function on the window object
  window.gtag = function(...args: any[]) {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', ga4MeasurementId);

  isInitialized = true;
  console.log(`[GA4] Initialized for ID: ${ga4MeasurementId}`);
};

/**
 * Tracks an event using GA4.
 * If GA4 is not configured via environment variables, it logs the event to the console.
 * @param eventName - The name of the event to track.
 * @param params - An optional object of event parameters.
 */
export const trackEvent = (eventName: string, params?: { [key: string]: any }) => {
  // Initialize GA4 on the first event track call.
  initializeGa4();

  if (isGa4Enabled && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    // Fallback for local development or if GA4 is not set up
    console.log(`[GA4 Mock Event] ${eventName}`, params);
  }
};
