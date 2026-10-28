import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Interceptador resiliente para falhas de billing e autorização do Google Maps
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const fullMsg = args
    .map((arg) => (typeof arg === 'string' ? arg : (arg as Error)?.message || ''))
    .join(' ');
  if (
    fullMsg.includes('BillingNotEnabledMapError') ||
    fullMsg.includes('billing-not-enabled-map-error') ||
    fullMsg.includes('Google Maps JavaScript API error')
  ) {
    console.warn(
      '[Google Maps Resiliente] Chave sem faturamento ativo detectada (BillingNotEnabledMapError). A aplicação ativou o motor vetorial interativo nativo.',
      ...args
    );
    try {
      sessionStorage.setItem('gmp_billing_disabled', 'true');
      window.dispatchEvent(new CustomEvent('gmp_billing_error'));
    } catch {}
    if (typeof (window as unknown as { gm_authFailure?: () => void }).gm_authFailure === 'function') {
      (window as unknown as { gm_authFailure: () => void }).gm_authFailure();
    }
    return;
  }
  originalConsoleError.apply(console, args);
};

// Ativa o registro do Service Worker para cacheamento offline e resiliência de rede
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(<App />);
