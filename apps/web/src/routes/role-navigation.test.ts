import { describe, expect, it } from 'vitest';
import { getRoleRedirectPath } from './ProtectedRoute';

describe('protected route role gating', () => {
  it('redirects a freelancer away from contractor routes', () => {
    expect(getRoleRedirectPath('/contractor/gigs', 'Freelancer')).toBe('/map');
  });

  it('redirects a contractor away from freelancer routes', () => {
    expect(getRoleRedirectPath('/profile', 'Contratante')).toBe('/contractor/gigs');
  });

  it('allows the authenticated role to stay on its own path', () => {
    expect(getRoleRedirectPath('/map', 'Freelancer')).toBeNull();
    expect(getRoleRedirectPath('/contractor/gigs', 'Contratante')).toBeNull();
  });
});
