import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp from './TestApp';

// Simple test entry point without complex dependencies
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);