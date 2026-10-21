import type { AuthState, UserRole } from '../src/context/session';

export type RootNavigationState = AuthState['status'];

export function getMobileRole(authState: AuthState): UserRole | null {
  if (authState.status !== 'authenticated') {
    return null;
  }
  return authState.role ?? 'Freelancer';
}

export function getRootNavigationState(authState: AuthState): RootNavigationState {
  return authState.status;
}
