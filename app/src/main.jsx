import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silently fail if service worker registration fails
    });
  });
}

// Store the beforeinstallprompt event for later use
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Dispatch a custom event to notify the app
  window.dispatchEvent(new CustomEvent('appinstallable', { detail: { prompt: e } }));
});

// Listen for successful installation
window.addEventListener('appinstalled', () => {
  // Clear the deferredPrompt
  deferredPrompt = null;
  // Dispatch a custom event to notify the app
  window.dispatchEvent(new CustomEvent('appinstalled'));
});

// Export a function to trigger the install prompt
window.showInstallPrompt = async () => {
  if (!deferredPrompt) {
    return false;
  }
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Clear the deferredPrompt
  deferredPrompt = null;
  return outcome === 'accepted';
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
