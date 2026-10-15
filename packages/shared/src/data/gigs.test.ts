import { describe, it, expect } from 'vitest';
import { mockGigs, filterGigsByProfession } from './mockGigs';

describe('Gigs and Domain Logic - TDD Suite', () => {
  it('should have mock gigs available with valid attributes', () => {
    expect(mockGigs.length).toBeGreaterThan(0);
    mockGigs.forEach((gig) => {
      expect(gig.id).toBeDefined();
      expect(gig.venueName).toBeTruthy();
      expect(gig.rate).toBeGreaterThan(0);
      expect(gig.latLng).toHaveProperty('lat');
      expect(gig.latLng).toHaveProperty('lng');
      expect(['Bartender', 'Garçom', 'Cozinheiro', 'Cumim']).toContain(gig.profession);
    });
  });

  it('should filter gigs by profession correctly', () => {
    const bartenders = filterGigsByProfession(mockGigs, 'Bartender');
    expect(bartenders.length).toBeGreaterThan(0);
    expect(bartenders.every((g) => g.profession === 'Bartender')).toBe(true);

    const waiters = filterGigsByProfession(mockGigs, 'Garçom');
    expect(waiters.length).toBeGreaterThan(0);
    expect(waiters.every((g) => g.profession === 'Garçom')).toBe(true);

    const all = filterGigsByProfession(mockGigs, 'Todos');
    expect(all.length).toBe(mockGigs.length);
  });
});
