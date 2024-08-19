import React from 'react';
import ReactDOM from 'react-dom/client'; // Changement ici
import './index.css';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Utiliser createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

