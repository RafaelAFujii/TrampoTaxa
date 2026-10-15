import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Ativa o registro do Service Worker para cacheamento offline e resiliência de rede
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
