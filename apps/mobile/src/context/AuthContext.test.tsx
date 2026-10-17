import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  authStateReducer,
  persistSessionToken,
  removeSessionToken,
  restoreSession,
  type AuthState,
  type SecureTokenStorage,
} from './session';

const createStorage = (overrides: Partial<SecureTokenStorage> = {}): SecureTokenStorage => ({
  getItemAsync: vi.fn().mockResolvedValue(null),
  setItemAsync: vi.fn().mockResolvedValue(undefined),
  deleteItemAsync: vi.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('Mobile auth session state', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('restores a saved JWT into the authenticated state', async () => {
    const storage = createStorage({
      getItemAsync: vi.fn().mockResolvedValue('saved-jwt'),
    });

    const restored = await restoreSession(storage);

    expect(restored).toEqual({ status: 'authenticated', token: 'saved-jwt' });
    expect(
      authStateReducer({ status: 'restoring' }, { type: 'RESTORE_FINISHED', token: 'saved-jwt' })
    ).toEqual(restored);
  });

  it('ends restoration without a token in the unauthenticated state', async () => {
    const restored = await restoreSession(createStorage());

    expect(restored).toEqual({ status: 'unauthenticated' });
    expect(
      authStateReducer({ status: 'restoring' }, { type: 'RESTORE_FINISHED', token: null })
    ).toEqual(restored);
  });

  it('clears in-memory credentials on sign-out', () => {
    const authenticated: AuthState = { status: 'authenticated', token: 'saved-jwt' };

    expect(authStateReducer(authenticated, { type: 'SIGNED_OUT' })).toEqual({
      status: 'unauthenticated',
    });
  });

  it('persists a non-empty JWT using secure storage', async () => {
    const storage = createStorage();

    await persistSessionToken(storage, 'new-jwt');

    expect(storage.setItemAsync).toHaveBeenCalledWith('trampotaxa.auth.jwt', 'new-jwt');
  });

  it('rejects an empty JWT and storage failures', async () => {
    const storage = createStorage({
      setItemAsync: vi.fn().mockRejectedValue(new Error('SecureStore unavailable')),
    });

    await expect(persistSessionToken(storage, '   ')).rejects.toThrow('Cannot persist an empty JWT');
    await expect(persistSessionToken(storage, 'new-jwt')).rejects.toThrow('SecureStore unavailable');
  });

  it('removes the persisted JWT on sign-out', async () => {
    const storage = createStorage();

    await removeSessionToken(storage);

    expect(storage.deleteItemAsync).toHaveBeenCalledWith('trampotaxa.auth.jwt');
  });

  it('reports secure-storage restore failures and remains unauthenticated', async () => {
    const storageError = new Error('SecureStore unavailable');
    const storage = createStorage({
      getItemAsync: vi.fn().mockRejectedValue(storageError),
    });
    const logError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(restoreSession(storage)).resolves.toEqual({ status: 'unauthenticated' });
    expect(logError).toHaveBeenCalledWith('Failed to restore Mobile auth session', storageError);
  });
});
