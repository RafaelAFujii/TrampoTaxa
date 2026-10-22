import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const freelancerOnlyRoutes = ['/map', '/active-gig', '/earnings'];
const contractorOnlyRoutes = ['/contractor/gigs', '/contractor/create', '/contractor/reports', '/contractor/chat'];

export function getRoleRedirectPath(pathname: string, role?: 'Freelancer' | 'Contratante') {
  if (role === 'Freelancer' && contractorOnlyRoutes.some((route) => pathname.startsWith(route))) {
    return '/map';
  }

  if (role === 'Contratante' && freelancerOnlyRoutes.some((route) => pathname.startsWith(route))) {
    return '/contractor/gigs';
  }

  return null;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0E] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00E676] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-zinc-400">Carregando autenticação...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const redirectPath = getRoleRedirectPath(location.pathname, user?.role);
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
