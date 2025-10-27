import { isGa4Enabled } from '../config';

// FIX: Moved the global declaration to the top level of the file.
// An ambient module declaration is only allowed at the top level.
// This makes the types for `window.dataLayer` and `window.gtag` available and resolves the TypeScript errors.
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Pushes an event to the dataLayer for Google Tag Manager to process.
 * If GA4/GTM is not configured via environment variables, it logs the event to the console.
 * @param eventName - The name of the event. This becomes the 'event' key in the dataLayer object,
 * which can be used to fire triggers in GTM.
 * @param params - An optional object of event parameters that will be pushed to the dataLayer.
 */
export const trackEvent = (eventName: string, params?: { [key: string]: any }) => {
  // GTM's snippet in index.html initializes window.dataLayer. We just ensure it's an array.
  window.dataLayer = window.dataLayer || [];

  if (isGa4Enabled) {
    // The standard way to send events to GTM is by pushing an object
    // to the dataLayer with an 'event' key.
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  } else {
    // Fallback for local development or if GTM is not set up
    console.log(`[GTM Mock Event] ${eventName}`, params);
  }
};
