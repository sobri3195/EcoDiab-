import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastProvider } from './components/Toast';
import { AppProvider } from './lib/app-context';
import { AlertCenterProvider } from './lib/alert-center-context';
import { initializeOfflineSync } from './lib/api';
import './styles.css';

initializeOfflineSync();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AlertCenterProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AlertCenterProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
