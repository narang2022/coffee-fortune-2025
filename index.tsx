// FIX: Import types.ts here to make global JSX type definitions available across the entire application.
// FIX: Reordered imports to load React before './types'. This ensures React's global JSX types are available for augmentation, resolving errors where standard HTML elements were not recognized.
import React from 'react';
import './types';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);