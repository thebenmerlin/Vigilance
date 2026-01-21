/**
 * =============================================================================
 * VIGILANCE DASHBOARD - Application Entry Point
 * =============================================================================
 * 
 * This is the main entry point for the React application.
 * It renders the root App component into the DOM.
 * 
 * React 18 uses createRoot for concurrent rendering features.
 * StrictMode helps catch potential problems during development.
 * =============================================================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Get the root element from index.html
const rootElement = document.getElementById('root');

// Safety check - ensure root element exists
if (!rootElement) {
    throw new Error('Failed to find root element. Check index.html for <div id="root"></div>');
}

// Create React 18 root and render the application
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
