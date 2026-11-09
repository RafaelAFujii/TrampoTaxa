import { describe, expect, it } from 'vitest';
import {
  canApplyToGig,
  applyToGigReducer,
  confirmGigAcceptance,
  validateQrCodeCheckIn,
  requestCheckOutState,
  autoApproveCheckOutState,
  type FreelancerFlowState,
} from './freelancerFlowState';
import type { FreelancerGigItem } from '@trampotaxa/shared';

const MOCK_GIGS: FreelancerGigItem[] = [
  {
    id: 'gig-1',
    venueName: 'Taj Bar Curitiba',
    role: 'Bartender',
    neighborhood: 'Batel',
    shiftTime: '19:00 - 01:00',
    rate: 260,
    rateFormatted: 'R$ 260,00',
    status: 'disponivel',
  },
  {
    id: 'gig-2',
    venueName: 'Boteco São Jorge',
    role: 'Bartender',
    neighborhood: 'Centro Cívico',
    shiftTime: '19:00 - 01:00',
    rate: 240,
    rateFormatted: 'R$ 240,00',
    status: 'disponivel',
  },
  {
    id: 'gig-3',
    venueName: 'Bistrô do Batel',
    role: 'Garçom',
    neighborhood: 'Batel',
    shiftTime: '19:00 - 01:00',
    rate: 220,
    rateFormatted: 'R$ 220,00',
    status: 'disponivel',
  },
  {
    id: 'gig-4',
    venueName: 'Bar do Alemão',
    role: 'Garçom',
    neighborhood: 'Largo da Ordem',
    shiftTime: '19:00 - 01:00',
    rate: 230,
    rateFormatted: 'R$ 230,00',
    status: 'disponivel',
  },
];

describe('Freelancer Overbooking & Flow Business Logic', () => {
  it('allows applying up to 3 concurrent gigs', () => {
    let state: FreelancerFlowState = {
      gigs: MOCK_GIGS,
      activeShift: null,
      toastMessage: null,
    };

    expect(canApplyToGig(state, 'gig-1')).toBe(true);
    state = applyToGigReducer(state, 'gig-1');
    expect(state.gigs.find((g) => g.id === 'gig-1')?.status).toBe('candidatado');

    expect(canApplyToGig(state, 'gig-2')).toBe(true);
    state = applyToGigReducer(state, 'gig-2');
    expect(state.gigs.find((g) => g.id === 'gig-2')?.status).toBe('candidatado');

    expect(canApplyToGig(state, 'gig-3')).toBe(true);
    state = applyToGigReducer(state, 'gig-3');
    expect(state.gigs.find((g) => g.id === 'gig-3')?.status).toBe('candidatado');

    // 4th concurrent application must be blocked
    expect(canApplyToGig(state, 'gig-4')).toBe(false);
  });

  it('blocks application if freelancer already has an active confirmed shift', () => {
    const stateWithActiveShift: FreelancerFlowState = {
      gigs: MOCK_GIGS,
      activeShift: {
        gigId: 'gig-1',
        venueName: 'Taj Bar Curitiba',
        role: 'Bartender',
        rate: 260,
        rateFormatted: 'R$ 260,00',
        status: 'em_turno',
      },
      toastMessage: null,
    };

    expect(canApplyToGig(stateWithActiveShift, 'gig-2')).toBe(false);
  });

  it('confirms the winning gig and automatically cancels all other active applications', () => {
    let state: FreelancerFlowState = {
      gigs: MOCK_GIGS,
      activeShift: null,
      toastMessage: null,
    };

    // Apply to 3 gigs
    state = applyToGigReducer(state, 'gig-1');
    state = applyToGigReducer(state, 'gig-2');
    state = applyToGigReducer(state, 'gig-3');

    // Contractor accepts gig-2
    state = confirmGigAcceptance(state, 'gig-2');

    // Winning gig must be 'confirmado'
    expect(state.gigs.find((g) => g.id === 'gig-2')?.status).toBe('confirmado');

    // Competing applications must be 'cancelado'
    expect(state.gigs.find((g) => g.id === 'gig-1')?.status).toBe('cancelado');
    expect(state.gigs.find((g) => g.id === 'gig-3')?.status).toBe('cancelado');

    // Gig 4 remains available
    expect(state.gigs.find((g) => g.id === 'gig-4')?.status).toBe('disponivel');

    // Active shift is initialized
    expect(state.activeShift).not.toBeNull();
    expect(state.activeShift?.gigId).toBe('gig-2');
    expect(state.activeShift?.status).toBe('aguardando_checkin');
    expect(state.toastMessage).toContain('Você foi contratado!');
  });

  it('validates Master QR Code check-in strictly with QR_MESTRE_123', () => {
    const shift = {
      gigId: 'gig-2',
      venueName: 'Boteco São Jorge',
      role: 'Bartender',
      rate: 240,
      rateFormatted: 'R$ 240,00',
      status: 'aguardando_checkin' as const,
    };

    const invalidResult = validateQrCodeCheckIn(shift, 'QR_INVALIDO');
    expect(invalidResult.success).toBe(false);

    const validResult = validateQrCodeCheckIn(shift, 'QR_MESTRE_123');
    expect(validResult.success).toBe(true);
    expect(validResult.updatedShift?.status).toBe('em_turno');
    expect(validResult.updatedShift?.checkInTimestamp).toBeDefined();
  });

  it('handles checkout request and auto-approval window transitioning to pix_agendado', () => {
    const shift = {
      gigId: 'gig-2',
      venueName: 'Boteco São Jorge',
      role: 'Bartender',
      rate: 240,
      rateFormatted: 'R$ 240,00',
      status: 'em_turno' as const,
    };

    const checkoutState = requestCheckOutState(shift);
    expect(checkoutState.status).toBe('checkout_pendente_aprovacao');
    expect(checkoutState.autoCheckoutDeadline).toBeDefined();

    const approvedState = autoApproveCheckOutState(checkoutState);
    expect(approvedState.status).toBe('pix_agendado');
    expect(approvedState.pixScheduledDate).toBeDefined();
  });
});
