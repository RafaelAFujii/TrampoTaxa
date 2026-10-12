import { describe, it, expect } from 'vitest';
import { INITIAL_CONTRACTOR_GIGS, INITIAL_CHAT_MESSAGES } from '../data/mockContractorData';

describe('Contractor Domain Models - TDD Suite', () => {
  it('should have initial contractor gigs populated with correct states', () => {
    expect(INITIAL_CONTRACTOR_GIGS.length).toBeGreaterThan(0);
    const openGigs = INITIAL_CONTRACTOR_GIGS.filter((g) => g.status === 'Aberta');
    expect(openGigs.length).toBeGreaterThan(0);
  });

  it('should calculate correct applicant stats for gigs', () => {
    const gigWithApplicants = INITIAL_CONTRACTOR_GIGS.find((g) => g.id === 'cgig-101');
    expect(gigWithApplicants).toBeDefined();
    expect(gigWithApplicants?.applicants.length).toBe(3);

    // Verify rating bounds
    gigWithApplicants?.applicants.forEach((app) => {
      expect(app.rating).toBeGreaterThanOrEqual(1);
      expect(app.rating).toBeLessThanOrEqual(5);
    });
  });

  it('should have verified chat messages associated with gig IDs', () => {
    expect(INITIAL_CHAT_MESSAGES.length).toBeGreaterThan(0);
    INITIAL_CHAT_MESSAGES.forEach((msg) => {
      expect(msg.gigId).toBeTruthy();
      expect(msg.senderName).toBeTruthy();
      expect(['Contratante', 'Freelancer']).toContain(msg.senderRole);
    });
  });
});
