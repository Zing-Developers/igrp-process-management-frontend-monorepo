import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';
import { initializeApiConfig } from './config/api-setup';

// Initialize API configuration before rendering the app
initializeApiConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);