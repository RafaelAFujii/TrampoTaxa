import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginScreen } from '../screens/LoginScreen';
import { CadastroScreen } from '../screens/CadastroScreen';
import { MapDashboardScreen } from '../screens/MapDashboardScreen';
import { ActiveGigScreen } from '../screens/ActiveGigScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ContractorGigsScreen } from '../screens/contractor/ContractorGigsScreen';
import { CreateGigScreen } from '../screens/contractor/CreateGigScreen';
import { ContractorReportsScreen } from '../screens/contractor/ContractorReportsScreen';
import { ContractorChatScreen } from '../screens/contractor/ContractorChatScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';

/**
 * Componente inteligente para redirecionar '/' para o painel correspondente ao papel
 */
function IndexRedirect() {
  const { user } = useAuth();
  if (user?.role === 'Contratante') {
    return <Navigate to="/contractor/gigs" replace />;
  }
  return <Navigate to="/map" replace />;
}

/**
 * Configuração central de roteamento da aplicação com React Router v6+
 * Rotas públicas: /login, /cadastro (Primeiro Acesso)
 * Rotas do Freelancer: /map, /active-gig, /earnings, /profile, /settings
 * Rotas do Contratante: /contractor/gigs, /contractor/create, /contractor/reports, /contractor/chat
 */
export const router = createBrowserRouter([
  // Rota de Login
  {
    path: '/login',
    element: <LoginScreen />,
  },
  // Rota de Cadastro / Primeiro Acesso
  {
    path: '/cadastro',
    element: <CadastroScreen />,
  },
  // Estrutura Protegida
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
        element: <IndexRedirect />,
      },
      // Rotas do Freelancer
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
      // Rotas do Contratante
      {
        path: 'contractor/gigs',
        element: <ContractorGigsScreen />,
      },
      {
        path: 'contractor/create',
        element: <CreateGigScreen />,
      },
      {
        path: 'contractor/reports',
        element: <ContractorReportsScreen />,
      },
      {
        path: 'contractor/chat',
        element: <ContractorChatScreen />,
      },
    ],
  },
  // Fallback para qualquer rota não mapeada
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
