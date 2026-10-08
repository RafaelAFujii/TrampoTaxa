import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

/**
 * Componente de rota protegida.
 * Redireciona usuários não autenticados para a tela de Login (/login).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
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
    // Redireciona para o login salvando o caminho de origem
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
