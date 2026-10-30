import { createHashRouter, Navigate } from 'react-router-dom';
import { LoginScreen } from '../screens/LoginScreen';
import { CadastroScreen } from '../screens/CadastroScreen';
import { MapDashboardScreen } from '../screens/MapDashboardScreen';
import { ActiveGigScreen } from '../screens/ActiveGigScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ContractorDashboardScreen } from '../screens/contractor/ContractorDashboardScreen';
import { ContractorGigsScreen } from '../screens/contractor/ContractorGigsScreen';
import { CreateGigScreen } from '../screens/contractor/CreateGigScreen';
import { ContractorReportsScreen } from '../screens/contractor/ContractorReportsScreen';
import { ContractorChatScreen } from '../screens/contractor/ContractorChatScreen';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';

function LoginRouteGate() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.role === 'Contratante' ? '/contractor/dashboard' : '/map'} replace />;
  }
  return <LoginScreen />;
}

function IndexRedirect() {
  const { user } = useAuth();
  if (user?.role === 'Contratante') {
    return <Navigate to="/contractor/dashboard" replace />;
  }
  return <Navigate to="/map" replace />;
}

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginRouteGate />,
  },
  {
    path: '/login/freelancer',
    element: <LoginRouteGate />,
  },
  {
    path: '/login/contractor',
    element: <LoginRouteGate />,
  },
  {
    path: '/cadastro',
    element: <CadastroScreen />,
  },
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
      {
        path: 'contractor/dashboard',
        element: <ContractorDashboardScreen />,
      },
      {
        path: 'contractor',
        element: <Navigate to="/contractor/dashboard" replace />,
      },
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
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
