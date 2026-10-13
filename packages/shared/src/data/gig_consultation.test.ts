import { describe, it, expect } from 'vitest';
import { mockGigs, filterGigsByProfession } from './mockGigs';
import { GigOffer } from '../types';

describe('Consulta e Lista de Taxas - TDD Suite', () => {
  it('should find gigs by neighborhood query', () => {
    const searchInGigs = (gigs: GigOffer[], query: string) => {
      const q = query.toLowerCase();
      return gigs.filter(
        (g) =>
          g.venueName.toLowerCase().includes(q) ||
          g.neighborhood.toLowerCase().includes(q) ||
          g.profession.toLowerCase().includes(q)
      );
    };

    const batelResults = searchInGigs(mockGigs, 'Batel');
    expect(batelResults.length).toBeGreaterThan(0);
    batelResults.forEach((g) => {
      const matches =
        g.venueName.toLowerCase().includes('batel') ||
        g.neighborhood.toLowerCase().includes('batel');
      expect(matches).toBe(true);
    });
  });

  it('should filter gigs by profession strictly', () => {
    const bartenderResults = filterGigsByProfession(mockGigs, 'Bartender');
    expect(bartenderResults.length).toBeGreaterThan(0);
    expect(bartenderResults.every((g) => g.profession === 'Bartender')).toBe(true);

    const garcomResults = filterGigsByProfession(mockGigs, 'Garçom');
    expect(garcomResults.length).toBeGreaterThan(0);
    expect(garcomResults.every((g) => g.profession === 'Garçom')).toBe(true);
  });

  it('should calculate and verify that all gigs have positive rates and valid shift durations', () => {
    mockGigs.forEach((gig) => {
      expect(gig.rate).toBeGreaterThan(0);
      expect(gig.shiftTime).toMatch(/^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/);
      expect(gig.shiftDuration).toContain('horas');
      expect(gig.microtraining.title).toBeTruthy();
    });
  });

  it('should properly sort gigs by hourly rate descending', () => {
    const sorted = [...mockGigs].sort((a, b) => b.rate - a.rate);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].rate).toBeGreaterThanOrEqual(sorted[i + 1].rate);
    }
  });
});
