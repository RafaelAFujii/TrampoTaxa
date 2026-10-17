import type { AuthState } from '../src/context/session';

export type RootNavigationState = AuthState['status'];

export function getRootNavigationState(authState: AuthState): RootNavigationState {
  return authState.status;
}
