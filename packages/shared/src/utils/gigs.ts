import type { GigOffer } from '../types';

export const filterGigsByProfession = (gigs: GigOffer[], profession?: string): GigOffer[] => {
  if (!profession || profession === 'Todos') return gigs;
  return gigs.filter((gig) => gig.profession.toLowerCase() === profession.toLowerCase());
};
