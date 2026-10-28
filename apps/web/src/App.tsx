import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './constants/maps';
import { AuthProvider } from './context/AuthContext';
import { ContractorProvider } from './context/ContractorContext';
import { router } from './routes/routes';

// Configuração do cliente React Query com 5 min de staleTime e 1 retry
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [billingDisabled, setBillingDisabled] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('gmp_billing_disabled') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleBillingError = () => {
      setBillingDisabled(true);
    };

    window.addEventListener('gmp_billing_error', handleBillingError);
    return () => {
      window.removeEventListener('gmp_billing_error', handleBillingError);
    };
  }, []);

  const activeKey = billingDisabled ? '' : GOOGLE_MAPS_API_KEY;

  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider
        apiKey={activeKey}
        onError={(err) => {
          console.warn('[Google Maps APIProvider] Erro ao carregar motor:', err);
          try {
            sessionStorage.setItem('gmp_billing_disabled', 'true');
          } catch {}
          setBillingDisabled(true);
        }}
      >
        <AuthProvider>
          <ContractorProvider>
            <RouterProvider router={router} />
          </ContractorProvider>
        </AuthProvider>
      </APIProvider>
    </QueryClientProvider>
  );
}
