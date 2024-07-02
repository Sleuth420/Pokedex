import React from 'react';
import { createRoot } from 'react-dom/client'; // Updated import for createRoot
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Get the root element and create the root
const container = document.getElementById('root');
const root = createRoot(container); // createRoot instead of ReactDOM.render

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
