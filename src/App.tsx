import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './constants/maps';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes/routes';

/**
 * Ponto de entrada da aplicação TrampoTaxa
 * Configura os Providers centrais:
 * - Google Maps APIProvider
 * - AuthProvider (Context API para Freelancer e Contratante)
 * - RouterProvider (React Router v6+ com createBrowserRouter)
 */
export default function App() {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </APIProvider>
  );
}
