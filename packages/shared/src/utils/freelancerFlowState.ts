import type { FreelancerGigItem, ActiveShiftState, ApplicationStatus } from '../types/freelancerFlow';

export interface FreelancerFlowState {
  gigs: FreelancerGigItem[];
  activeShift: ActiveShiftState | null;
  toastMessage: string | null;
}

export const MAX_CONCURRENT_APPLICATIONS = 3;
export const MASTER_QR_CODE_SECRET = 'QR_MESTRE_123';

/**
 * Verifica se o freelancer pode se candidatar à vaga.
 * Regras:
 * 1. Não pode ter turno confirmado ou em andamento.
 * 2. Não pode exceder 3 candidaturas concorrentes ativas ('candidatado').
 * 3. A vaga precisa estar no status 'disponivel'.
 */
export function canApplyToGig(state: FreelancerFlowState, gigId: string): boolean {
  if (state.activeShift !== null) {
    return false;
  }

  const activeCount = state.gigs.filter((g) => g.status === 'candidatado').length;
  if (activeCount >= MAX_CONCURRENT_APPLICATIONS) {
    return false;
  }

  const targetGig = state.gigs.find((g) => g.id === gigId);
  if (!targetGig || targetGig.status !== 'disponivel') {
    return false;
  }

  return true;
}

/**
 * Aplica para uma vaga alterando o status para 'candidatado'
 */
export function applyToGigReducer(state: FreelancerFlowState, gigId: string): FreelancerFlowState {
  if (!canApplyToGig(state, gigId)) {
    return state;
  }

  return {
    ...state,
    gigs: state.gigs.map((gig) =>
      gig.id === gigId
        ? { ...gig, status: 'candidatado' as ApplicationStatus, appliedAt: Date.now() }
        : gig
    ),
  };
}

/**
 * Confirmação do contratante simulada:
 * - Define a vaga vencedora como 'confirmado'.
 * - Cancela todas as outras candidaturas ativas ('cancelado').
 * - Inicia o turno ativo no status 'aguardando_checkin'.
 * - Emite mensagem de toast para notificação.
 */
export function confirmGigAcceptance(
  state: FreelancerFlowState,
  winningGigId: string
): FreelancerFlowState {
  const winningGig = state.gigs.find((g) => g.id === winningGigId);
  if (!winningGig) {
    return state;
  }

  const updatedGigs = state.gigs.map((gig) => {
    if (gig.id === winningGigId) {
      return { ...gig, status: 'confirmado' as ApplicationStatus };
    }
    if (gig.status === 'candidatado') {
      return { ...gig, status: 'cancelado' as ApplicationStatus };
    }
    return gig;
  });

  const activeShift: ActiveShiftState = {
    gigId: winningGig.id,
    venueName: winningGig.venueName,
    role: winningGig.role,
    rate: winningGig.rate,
    rateFormatted: winningGig.rateFormatted,
    status: 'aguardando_checkin',
  };

  return {
    ...state,
    gigs: updatedGigs,
    activeShift,
    toastMessage:
      '🎉 Você foi contratado! Suas outras candidaturas concorrentes foram canceladas automaticamente.',
  };
}

/**
 * Validação do Check-in presencial via QR Code Mestre
 */
export function validateQrCodeCheckIn(
  currentShift: ActiveShiftState,
  qrCodePayload: string
): { success: boolean; message: string; updatedShift?: ActiveShiftState } {
  if (qrCodePayload.trim() !== MASTER_QR_CODE_SECRET) {
    return {
      success: false,
      message: 'QR Code inválido. Aponte a câmera para o QR Code Mestre do estabelecimento.',
    };
  }

  const updatedShift: ActiveShiftState = {
    ...currentShift,
    status: 'em_turno',
    checkInTimestamp: Date.now(),
  };

  return {
    success: true,
    message: `Check-in confirmado no ${currentShift.venueName}! Bom turno.`,
    updatedShift,
  };
}

/**
 * Solicitação de Check-out e início da janela de contestação de 2 horas
 */
export function requestCheckOutState(currentShift: ActiveShiftState): ActiveShiftState {
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return {
    ...currentShift,
    status: 'checkout_pendente_aprovacao',
    checkOutTimestamp: Date.now(),
    autoCheckoutDeadline: Date.now() + twoHoursMs,
  };
}

/**
 * Aprovação tácita do Auto-Checkout após encerramento da janela sem contestação
 */
export function autoApproveCheckOutState(currentShift: ActiveShiftState): ActiveShiftState {
  return {
    ...currentShift,
    status: 'pix_agendado',
    pixScheduledDate: 'Repasse Automático Agendado (PIX Seguro)',
  };
}
