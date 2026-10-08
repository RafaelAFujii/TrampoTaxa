import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginScreen } from '../screens/LoginScreen';
import { CadastroScreen } from '../screens/CadastroScreen';
import { MapDashboardScreen } from '../screens/MapDashboardScreen';
import { ActiveGigScreen } from '../screens/ActiveGigScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';

/**
 * Configuração central de roteamento da aplicação com React Router v6+
 * Rotas públicas: /login, /cadastro (Primeiro Acesso)
 * Rotas autenticadas: /map, /active-gig, /earnings, /profile, /settings
 */
export const router = createBrowserRouter([
  // Rota de Login (Tela inicial para usuários não autenticados)
  {
    path: '/login',
    element: <LoginScreen />,
  },
  // Rota de Cadastro / Primeiro Acesso
  {
    path: '/cadastro',
    element: <CadastroScreen />,
  },
  // Estrutura Protegida (Exige usuário logado através do ProtectedRoute)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/map" replace />,
      },
      {
        path: 'map',
        element: <MapDashboardScreen />,
      },
      {
        path: 'active-gig',
        element: <ActiveGigScreen />,
      },
      {
        path: 'earnings',
        element: <EarningsScreen />,
      },
      {
        path: 'profile',
        element: <ProfileScreen />,
      },
      {
        path: 'settings',
        element: <SettingsScreen />,
      },
    ],
  },
  // Fallback para qualquer rota não mapeada
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
