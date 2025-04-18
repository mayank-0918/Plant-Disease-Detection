import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 uses `createRoot`
import './index.css'; // Optional: If you have styles
import App from './App.jsx'; // Import your App component
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Make sure there's an element with id='root' in your HTML
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
