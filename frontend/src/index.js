import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';

// This links the React code to the <div id="root"> in your index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);