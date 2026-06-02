import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

window.addEventListener('error', (event) => {
  (window as any).ipcRenderer?.send('renderer-error', event.error?.stack || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  (window as any).ipcRenderer?.send('renderer-error', `Unhandled Promise Rejection: ${event.reason}`);
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
