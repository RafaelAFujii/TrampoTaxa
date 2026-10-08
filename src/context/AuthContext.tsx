import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Freelancer' | 'Contratante';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  primeiroAcesso: boolean;
  profession?: 'Bartender' | 'Garçom';
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  cadastrar: (data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    profession?: 'Bartender' | 'Garçom';
  }) => Promise<boolean>;
  logout: () => void;
  verificarPrimeiroAcesso: () => boolean;
  completarPrimeiroAcesso: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'trampo_taxa_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // LocalStorage fallback
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [user]);

  /**
   * Realiza login mockado com suporte a perfis 'Freelancer' e 'Contratante'
   */
  const login = async (email: string, role: UserRole = 'Freelancer'): Promise<boolean> => {
    setIsLoading(true);
    // Simula latência de rede realista
    await new Promise((resolve) => setTimeout(resolve, 400));

    const mockUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: role === 'Freelancer' ? 'Gabriel Silva' : 'Restaurante Madalosso',
      email: email || (role === 'Freelancer' ? 'freelancer@curitiba.com' : 'gerente@restaurante.com'),
      role,
      avatarUrl:
        role === 'Freelancer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240&auto=format&fit=crop&q=80',
      phone: '(41) 99999-0000',
      primeiroAcesso: false,
      profession: role === 'Freelancer' ? 'Bartender' : undefined,
    };

    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  /**
   * Realiza cadastro mockado marcando 'primeiroAcesso' como verdadeiro
   */
  const cadastrar = async (data: {
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    profession?: 'Bartender' | 'Garçom';
  }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      avatarUrl:
        data.role === 'Freelancer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=240&auto=format&fit=crop&q=80',
      phone: data.phone || '(41) 99999-0000',
      primeiroAcesso: true,
      profession: data.profession || 'Bartender',
    };

    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  /**
   * Finaliza sessão do usuário
   */
  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  /**
   * Valida se é o primeiro acesso do usuário cadastrado
   */
  const verificarPrimeiroAcesso = (): boolean => {
    return Boolean(user && user.primeiroAcesso);
  };

  /**
   * Conclui a etapa de onboarding/primeiro acesso
   */
  const completarPrimeiroAcesso = () => {
    if (user) {
      setUser({ ...user, primeiroAcesso: false });
    }
  };

  /**
   * Permite alternar rapidamente entre 'Freelancer' e 'Contratante' para testes
   */
  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
        name: newRole === 'Freelancer' ? 'Gabriel Silva' : 'Restaurante Madalosso',
      });
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        cadastrar,
        logout,
        verificarPrimeiroAcesso,
        completarPrimeiroAcesso,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
