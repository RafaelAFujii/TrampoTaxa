export const AUTH_TOKEN_STORAGE_KEY = 'trampotaxa.auth.jwt';

export type AuthState =
  | { status: 'restoring' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; token: string };

export type AuthAction =
  | { type: 'RESTORE_FINISHED'; token: string | null }
  | { type: 'SIGNED_IN'; token: string }
  | { type: 'SIGNED_OUT' };

export interface SecureTokenStorage {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

export function authStateReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_FINISHED':
      return action.token
        ? { status: 'authenticated', token: action.token }
        : { status: 'unauthenticated' };
    case 'SIGNED_IN':
      return { status: 'authenticated', token: action.token };
    case 'SIGNED_OUT':
      return { status: 'unauthenticated' };
  }
}

export async function restoreSession(storage: SecureTokenStorage): Promise<AuthState> {
  try {
    const token = await storage.getItemAsync(AUTH_TOKEN_STORAGE_KEY);
    return token?.trim()
      ? { status: 'authenticated', token }
      : { status: 'unauthenticated' };
  } catch (error) {
    console.error('Failed to restore Mobile auth session', error);
    return { status: 'unauthenticated' };
  }
}

export async function persistSessionToken(
  storage: SecureTokenStorage,
  token: string
): Promise<void> {
  if (!token.trim()) {
    throw new Error('Cannot persist an empty JWT');
  }
  await storage.setItemAsync(AUTH_TOKEN_STORAGE_KEY, token);
}

export async function removeSessionToken(storage: SecureTokenStorage): Promise<void> {
  await storage.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
}
