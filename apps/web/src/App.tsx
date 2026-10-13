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
  return (
    <QueryClientProvider client={queryClient}>
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <AuthProvider>
          <ContractorProvider>
            <RouterProvider router={router} />
          </ContractorProvider>
        </AuthProvider>
      </APIProvider>
    </QueryClientProvider>
  );
}
