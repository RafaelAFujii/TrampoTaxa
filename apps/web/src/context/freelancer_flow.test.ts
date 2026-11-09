import { describe, it, expect } from 'vitest';
import {
  canApplyToGig,
  applyToGigReducer,
  confirmGigAcceptance,
  validateQrCodeCheckIn,
  requestCheckOutState,
  autoApproveCheckOutState,
  MAX_CONCURRENT_APPLICATIONS,
  MASTER_QR_CODE_SECRET,
  FreelancerFlowState,
} from '@trampotaxa/shared';

describe('Web Freelancer Flow & 3 Pillars Parity Suite', () => {
  const createInitialState = (): FreelancerFlowState => ({
    gigs: [
      {
        id: 'gig-001',
        venueName: 'Taj Bar Curitiba',
        role: 'Bartender',
        neighborhood: 'Batel',
        shiftTime: '19:00 - 01:00',
        rate: 260,
        rateFormatted: 'R$ 260,00',
        status: 'disponivel',
      },
      {
        id: 'gig-002',
        venueName: 'Boteco São Jorge',
        role: 'Bartender',
        neighborhood: 'Centro Cívico',
        shiftTime: '19:00 - 01:00',
        rate: 240,
        rateFormatted: 'R$ 240,00',
        status: 'disponivel',
      },
      {
        id: 'gig-003',
        venueName: 'Bistrô do Batel',
        role: 'Garçom',
        neighborhood: 'Batel',
        shiftTime: '19:00 - 01:00',
        rate: 220,
        rateFormatted: 'R$ 220,00',
        status: 'disponivel',
      },
      {
        id: 'gig-004',
        venueName: 'Bar do Alemão',
        role: 'Garçom',
        neighborhood: 'Largo da Ordem',
        shiftTime: '19:00 - 01:00',
        rate: 230,
        rateFormatted: 'R$ 230,00',
        status: 'disponivel',
      },
    ],
    activeShift: null,
    toastMessage: null,
  });

  // Pilar 1: Overbooking Controlado
  it('Pilar 1 - Overbooking Controlado: permite no máximo 3 candidaturas concorrentes', () => {
    let state = createInitialState();
    expect(MAX_CONCURRENT_APPLICATIONS).toBe(3);

    expect(canApplyToGig(state, 'gig-001')).toBe(true);
    state = applyToGigReducer(state, 'gig-001');

    expect(canApplyToGig(state, 'gig-002')).toBe(true);
    state = applyToGigReducer(state, 'gig-002');

    expect(canApplyToGig(state, 'gig-003')).toBe(true);
    state = applyToGigReducer(state, 'gig-003');

    // 4ª vaga deve ser estritamente bloqueada
    expect(canApplyToGig(state, 'gig-004')).toBe(false);
  });

  it('Pilar 1 - Confirmação do Contratante: confirma a vaga vencedora e cancela automaticamente as outras', () => {
    let state = createInitialState();
    state = applyToGigReducer(state, 'gig-001');
    state = applyToGigReducer(state, 'gig-002');
    state = applyToGigReducer(state, 'gig-003');

    const confirmed = confirmGigAcceptance(state, 'gig-002');

    expect(confirmed.activeShift).not.toBeNull();
    expect(confirmed.activeShift?.gigId).toBe('gig-002');
    expect(confirmed.activeShift?.venueName).toBe('Boteco São Jorge');
    expect(confirmed.activeShift?.status).toBe('aguardando_checkin');

    // Outras candidaturas devem ter sido canceladas para 'cancelado'
    const gig1 = confirmed.gigs.find((g) => g.id === 'gig-001');
    const gig2 = confirmed.gigs.find((g) => g.id === 'gig-002');
    const gig3 = confirmed.gigs.find((g) => g.id === 'gig-003');

    expect(gig1?.status).toBe('cancelado');
    expect(gig2?.status).toBe('confirmado');
    expect(gig3?.status).toBe('cancelado');
    expect(confirmed.toastMessage).toContain('Você foi contratado!');
  });

  // Pilar 2: Scanner QR Mestre + Auto-Checkout
  it('Pilar 2 - Scanner QR Mestre: valida check-in apenas com código mestre correto', () => {
    const shift = {
      gigId: 'gig-001',
      venueName: 'Taj Bar Curitiba',
      role: 'Bartender',
      neighborhood: 'Batel',
      rate: 260,
      rateFormatted: 'R$ 260,00',
      status: 'aguardando_checkin' as const,
      checkInTime: null,
      checkOutTime: null,
      autoCheckoutDeadline: null,
      pixScheduledDate: null,
    };

    const invalidResult = validateQrCodeCheckIn(shift, 'QR_INVALIDO');
    expect(invalidResult.success).toBe(false);

    const validResult = validateQrCodeCheckIn(shift, MASTER_QR_CODE_SECRET);
    expect(validResult.success).toBe(true);
    expect(validResult.updatedShift?.status).toBe('em_turno');
    expect(validResult.updatedShift?.checkInTimestamp).toBeDefined();
  });

  it('Pilar 2 - Auto-Checkout: inicia janela de contestação e aprova PIX tacitamente', () => {
    const inProgressShift = {
      gigId: 'gig-001',
      venueName: 'Taj Bar Curitiba',
      role: 'Bartender',
      neighborhood: 'Batel',
      rate: 260,
      rateFormatted: 'R$ 260,00',
      status: 'em_turno' as const,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      autoCheckoutDeadline: null,
      pixScheduledDate: null,
    };

    const pendingCheckout = requestCheckOutState(inProgressShift);
    expect(pendingCheckout.status).toBe('checkout_pendente_aprovacao');
    expect(pendingCheckout.autoCheckoutDeadline).not.toBeNull();

    const autoApproved = autoApproveCheckOutState(pendingCheckout);
    expect(autoApproved.status).toBe('pix_agendado');
    expect(autoApproved.pixScheduledDate).not.toBeNull();
    expect(autoApproved.pixScheduledDate).not.toBeNull();
  });
});
