import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  authStateReducer,
  persistSessionToken,
  removeSessionToken,
  restoreSession,
  type AuthState,
  type UserRole,
} from './session';

interface AuthContextValue {
  state: AuthState;
  signIn: (token: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  handleUnauthorized: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authStateReducer, { status: 'restoring' });

  useEffect(() => {
    let mounted = true;
    void restoreSession(SecureStore).then((restored) => {
      if (mounted) {
        dispatch({
          type: 'RESTORE_FINISHED',
          token: restored.status === 'authenticated' ? restored.token : null,
          role: restored.status === 'authenticated' ? restored.role : undefined,
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (token: string, role: UserRole = 'Freelancer') => {
    dispatch({ type: 'SIGNED_OUT' });
    try {
      await persistSessionToken(SecureStore, token, role);
      dispatch({ type: 'SIGNED_IN', token, role });
    } catch (error) {
      console.error('Failed to persist Mobile auth session', error);
      dispatch({ type: 'SIGNED_OUT' });
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    dispatch({ type: 'SIGNED_OUT' });
    try {
      await removeSessionToken(SecureStore);
    } catch (error) {
      console.error('Failed to clear Mobile auth session', error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ state, signIn, signOut, handleUnauthorized: signOut }),
    [state, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
