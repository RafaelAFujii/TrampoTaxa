export const AUTH_TOKEN_STORAGE_KEY = 'trampotaxa.auth.jwt';

export type UserRole = 'Freelancer' | 'Contratante';

export type AuthState =
  | { status: 'restoring' }
  | { status: 'unauthenticated' }
  | { status: 'authenticated'; token: string; role?: UserRole };

export type AuthAction =
  | { type: 'RESTORE_FINISHED'; token: string | null; role?: UserRole }
  | { type: 'SIGNED_IN'; token: string; role?: UserRole }
  | { type: 'SIGNED_OUT' };

export interface SecureTokenStorage {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

function normalizeRole(role?: string | null): UserRole | undefined {
  if (!role) {
    return undefined;
  }
  return role === 'Contratante' ? 'Contratante' : 'Freelancer';
}

export function authStateReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_FINISHED':
      return action.token
        ? { status: 'authenticated', token: action.token, role: normalizeRole(action.role) }
        : { status: 'unauthenticated' };
    case 'SIGNED_IN':
      return { status: 'authenticated', token: action.token, role: normalizeRole(action.role) };
    case 'SIGNED_OUT':
      return { status: 'unauthenticated' };
  }
}

export async function restoreSession(storage: SecureTokenStorage): Promise<AuthState> {
  try {
    const raw = await storage.getItemAsync(AUTH_TOKEN_STORAGE_KEY);
    if (!raw?.trim()) {
      return { status: 'unauthenticated' };
    }

    try {
      const parsed = JSON.parse(raw) as { token?: string; role?: string };
      const token = parsed.token?.trim();
      if (!token) {
        return { status: 'unauthenticated' };
      }
      return { status: 'authenticated', token, role: normalizeRole(parsed.role) };
    } catch {
      return { status: 'authenticated', token: raw.trim() };
    }
  } catch (error) {
    console.error('Failed to restore Mobile auth session', error);
    return { status: 'unauthenticated' };
  }
}

export async function persistSessionToken(
  storage: SecureTokenStorage,
  token: string,
  role?: UserRole
): Promise<void> {
  if (!token.trim()) {
    throw new Error('Cannot persist an empty JWT');
  }

  const payload = role ? JSON.stringify({ token, role }) : token;
  await storage.setItemAsync(AUTH_TOKEN_STORAGE_KEY, payload);
}

export async function removeSessionToken(storage: SecureTokenStorage): Promise<void> {
  await storage.deleteItemAsync(AUTH_TOKEN_STORAGE_KEY);
}
