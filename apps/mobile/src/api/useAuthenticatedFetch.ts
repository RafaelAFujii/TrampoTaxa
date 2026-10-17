import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from './authenticatedFetch';

export function useAuthenticatedFetch() {
  const { state, handleUnauthorized } = useAuth();
  const token = state.status === 'authenticated' ? state.token : null;

  return useCallback(
    (input: RequestInfo | URL, init?: RequestInit) =>
      authenticatedFetch(input, init, { token, onUnauthorized: handleUnauthorized }),
    [token, handleUnauthorized]
  );
}
