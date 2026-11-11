import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Freelancer' | 'Contratante';

export interface VenueInfo {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  primeiroAcesso: boolean;
  profession?: string;
  cnpj?: string;
  businessSegment?: string;
  corporateName?: string;
  token?: string;
  pixKey?: string;
  rating?: number;
  venue?: VenueInfo;
}

export interface CadastroPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  profession?: string;
  cnpj?: string;
  businessSegment?: string;
  corporateName?: string;
  // Campos de endereço do Contratante
  venueName?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  cadastrar: (data: CadastroPayload) => Promise<boolean>;
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
   * Realiza login real chamando POST /api/auth/login no backend .NET (PostgreSQL)
   * Se a senha ou e-mail estiverem incorretos, lança erro com a mensagem da API.
   */
  const login = async (
    email: string,
    password = 'SenhaSegura123!',
    _role: UserRole = 'Freelancer'
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!response.ok) {
        let errorMsg = 'Email ou senha incorretos.';
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errorMsg = errData.message;
          }
        } catch {
          // fallback msg
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const mappedRole: UserRole = data.role === 'Contractor' ? 'Contratante' : 'Freelancer';

      const authUser: AuthUser = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: mappedRole,
        token: data.token,
        avatarUrl:
          mappedRole === 'Freelancer'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240&auto=format&fit=crop&q=80',
        phone: '(41) 99999-0000',
        primeiroAcesso: false,
        profession: data.specialty || (mappedRole === 'Freelancer' ? 'Bartender' : undefined),
        cnpj: mappedRole === 'Contratante' ? '12.345.678/0001-90' : undefined,
        pixKey: data.pixKey,
        rating: data.rating,
        venue: data.venueId
          ? {
              id: data.venueId,
              name: data.venueName || data.name,
              address: data.venueAddress || 'Av. do Batel, 1550',
              neighborhood: data.venueNeighborhood || 'Batel',
            }
          : undefined,
      };

      setUser(authUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Realiza cadastro real chamando POST /api/auth/register no backend .NET (PostgreSQL)
   */
  const cadastrar = async (data: CadastroPayload): Promise<boolean> => {
    setIsLoading(true);

    try {
      const backendRole = data.role === 'Contratante' ? 'Contractor' : 'Freelancer';

      const payload = {
        name: data.name,
        email: data.email.trim(),
        password: data.password || 'SenhaSegura123!',
        role: backendRole,
        document: data.cnpj || (data.role === 'Freelancer' ? '123.456.789-00' : '12.345.678/0001-90'),
        phone: data.phone || '(41) 99999-0000',
        pixKey: data.role === 'Freelancer' ? `${data.email.split('@')[0]}@pix.trampotaxa.com.br` : null,
        specialty: data.profession || (data.role === 'Freelancer' ? 'Bartender' : null),
        venueName: data.venueName || data.corporateName || data.name,
        address: data.address || 'Av. do Batel, 1550',
        neighborhood: data.neighborhood || 'Batel',
        city: data.city || 'Curitiba',
        state: data.state || 'PR',
        latitude: data.latitude ?? -25.4411,
        longitude: data.longitude ?? -49.2831,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = 'Erro ao cadastrar usuário.';
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errorMsg = errData.message;
          }
        } catch {
          // fallback
        }
        throw new Error(errorMsg);
      }

      const resData = await response.json();
      const mappedRole: UserRole = data.role;

      const newUser: AuthUser = {
        id: resData.userId,
        name: resData.name,
        email: resData.email,
        role: mappedRole,
        token: resData.token,
        avatarUrl:
          mappedRole === 'Freelancer'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=240&auto=format&fit=crop&q=80',
        phone: data.phone || '(41) 99999-0000',
        primeiroAcesso: true,
        profession: data.profession || (mappedRole === 'Freelancer' ? 'Bartender' : undefined),
        cnpj: data.cnpj,
        businessSegment: data.businessSegment,
        corporateName: data.corporateName || data.name,
        venue: resData.venueId
          ? {
              id: resData.venueId,
              name: resData.venueName || data.venueName || data.name,
              address: resData.venueAddress || data.address || 'Av. do Batel, 1550',
              neighborhood: resData.venueNeighborhood || data.neighborhood || 'Batel',
            }
          : undefined,
      };

      setUser(newUser);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Finaliza sessão do usuário e limpa o cache
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
