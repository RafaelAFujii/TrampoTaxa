import { describe, expect, it } from 'vitest';
import { getRootNavigationState } from './authNavigation';

describe('RootNavigator access boundary', () => {
  it('does not expose tabs while the session is restoring', () => {
    expect(getRootNavigationState({ status: 'restoring' })).toBe('restoring');
  });

  it('does not expose tabs without an authenticated session', () => {
    expect(getRootNavigationState({ status: 'unauthenticated' })).toBe('unauthenticated');
  });

  it('exposes tabs only after successful authentication', () => {
    expect(getRootNavigationState({ status: 'authenticated', token: 'jwt' })).toBe(
      'authenticated'
    );
  });
});
