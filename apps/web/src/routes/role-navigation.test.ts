import { describe, expect, it } from 'vitest';
import { getRoleRedirectPath } from './ProtectedRoute';

describe('protected route role gating', () => {
  it('redirects a freelancer away from contractor routes', () => {
    expect(getRoleRedirectPath('/contractor/dashboard', 'Freelancer')).toBe('/map');
    expect(getRoleRedirectPath('/contractor/gigs', 'Freelancer')).toBe('/map');
  });

  it('redirects a contractor away from freelancer routes', () => {
    expect(getRoleRedirectPath('/map', 'Contratante')).toBe('/contractor/dashboard');
    expect(getRoleRedirectPath('/earnings', 'Contratante')).toBe('/contractor/dashboard');
    expect(getRoleRedirectPath('/active-gig', 'Contratante')).toBe('/contractor/dashboard');
  });

  it('allows the authenticated role to stay on its own path', () => {
    expect(getRoleRedirectPath('/map', 'Freelancer')).toBeNull();
    expect(getRoleRedirectPath('/contractor/dashboard', 'Contratante')).toBeNull();
    expect(getRoleRedirectPath('/contractor/gigs', 'Contratante')).toBeNull();
    expect(getRoleRedirectPath('/profile', 'Contratante')).toBeNull();
    expect(getRoleRedirectPath('/profile', 'Freelancer')).toBeNull();
  });
});
