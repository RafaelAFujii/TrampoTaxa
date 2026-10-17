import { describe, expect, it, vi } from 'vitest';
import { authenticatedFetch } from './authenticatedFetch';

describe('authenticatedFetch', () => {
  it('adds a bearer token to operations declared private by OpenAPI', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    await authenticatedFetch('/gigs/1/apply', { method: 'POST' }, {
      token: 'private-jwt',
      fetchImpl,
    });

    expect(new Headers(fetchImpl.mock.calls[0][1]?.headers).get('Authorization')).toBe(
      'Bearer private-jwt'
    );
  });

  it('does not send credentials for public operations', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    await authenticatedFetch(
      '/auth/login',
      { method: 'POST', headers: { Authorization: 'Bearer caller-token' } },
      { token: 'private-jwt', fetchImpl }
    );

    expect(new Headers(fetchImpl.mock.calls[0][1]?.headers).has('Authorization')).toBe(false);
  });

  it('distinguishes public gig reads from the private gig creation operation', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));

    await authenticatedFetch('/gigs', { method: 'GET' }, {
      token: 'private-jwt',
      fetchImpl,
    });
    await authenticatedFetch('/gigs/1', { method: 'GET' }, {
      token: 'private-jwt',
      fetchImpl,
    });
    await authenticatedFetch('/gigs', { method: 'POST' }, {
      token: 'private-jwt',
      fetchImpl,
    });

    expect(new Headers(fetchImpl.mock.calls[0][1]?.headers).has('Authorization')).toBe(false);
    expect(new Headers(fetchImpl.mock.calls[1][1]?.headers).has('Authorization')).toBe(false);
    expect(new Headers(fetchImpl.mock.calls[2][1]?.headers).get('Authorization')).toBe(
      'Bearer private-jwt'
    );
  });

  it('refuses private operations without an authenticated session', async () => {
    const fetchImpl = vi.fn();

    await expect(
      authenticatedFetch('/auth/me', undefined, { token: null, fetchImpl })
    ).rejects.toThrow('without an authenticated session');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('clears the session after a private unauthorized response', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    const onUnauthorized = vi.fn().mockResolvedValue(undefined);

    await authenticatedFetch('/auth/me', undefined, {
      token: 'private-jwt',
      fetchImpl,
      onUnauthorized,
    });

    expect(onUnauthorized).toHaveBeenCalledOnce();
  });
});
