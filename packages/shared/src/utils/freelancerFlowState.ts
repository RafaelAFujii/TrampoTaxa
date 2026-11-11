import { create } from 'zustand';
import type {
  FreelancerGigItem,
  ActiveShiftState,
  ApplicationStatus,
  VenueReviewPayload,
} from '../types/freelancerFlow';

export interface FreelancerFlowState {
  gigs: FreelancerGigItem[];
  activeShift: ActiveShiftState | null;
  toastMessage: string | null;
}

export const MAX_CONCURRENT_APPLICATIONS = 3;
export const MASTER_QR_CODE_SECRET = 'QR_MESTRE_123';

export const INITIAL_FREELANCER_GIGS: FreelancerGigItem[] = [
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
  {
    id: 'gig-005',
    venueName: 'Quintal do Monge',
    role: 'Hostess',
    neighborhood: 'São Francisco',
    shiftTime: '20:00 - 02:00',
    rate: 250,
    rateFormatted: 'R$ 250,00',
    status: 'disponivel',
  },
];

/**
 * -------------------------------------------------------------
 * Funções Puras de Domínio / Regras de Negócio (Spec 006)
 * -------------------------------------------------------------
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

export function requestCheckOutState(currentShift: ActiveShiftState): ActiveShiftState {
  const twoHoursMs = 2 * 60 * 60 * 1000;
  return {
    ...currentShift,
    status: 'checkout_pendente_aprovacao',
    checkOutTimestamp: Date.now(),
    autoCheckoutDeadline: Date.now() + twoHoursMs,
  };
}

export function autoApproveCheckOutState(currentShift: ActiveShiftState): ActiveShiftState {
  return {
    ...currentShift,
    status: 'pix_agendado',
    pixScheduledDate: 'Repasse Automático Agendado (PIX Seguro)',
  };
}

/**
 * -------------------------------------------------------------
 * Zustand Store: useFreelancerFlowStore (Zero Context API)
 * -------------------------------------------------------------
 */

export interface FreelancerFlowActions {
  applyToGig: (gigId: string) => boolean;
  cancelApplication: (gigId: string) => void;
  performCheckIn: (qrCode: string) => { success: boolean; message: string };
  requestCheckOut: () => void;
  submitVenueReview: (review: VenueReviewPayload) => void;
  finishAndReceive: () => void;
  clearToast: () => void;
  setGigs: (gigs: FreelancerGigItem[]) => void;
  setActiveShift: (shift: ActiveShiftState | null) => void;
  setToastMessage: (msg: string | null) => void;
  resetToDefaults: () => void;
}

export interface FreelancerFlowStore extends FreelancerFlowState, FreelancerFlowActions {
  activeApplicationsCount: number;
  maxApplicationsReached: boolean;
}

const simulationTimers: Record<string, ReturnType<typeof setTimeout>> = {};
let autoCheckoutTimer: ReturnType<typeof setTimeout> | null = null;

const computeApplicationsDerived = (gigs: FreelancerGigItem[]) => {
  const activeApplicationsCount = gigs.filter((g) => g.status === 'candidatado').length;
  const maxApplicationsReached = activeApplicationsCount >= MAX_CONCURRENT_APPLICATIONS;
  return { activeApplicationsCount, maxApplicationsReached };
};

export const useFreelancerFlowStore = create<FreelancerFlowStore>((set, get) => ({
  gigs: INITIAL_FREELANCER_GIGS,
  activeShift: null,
  toastMessage: null,
  ...computeApplicationsDerived(INITIAL_FREELANCER_GIGS),

  applyToGig: (gigId: string): boolean => {
    const state = get();

    if (state.activeShift !== null) {
      set({ toastMessage: 'Você já possui um turno confirmado ou em andamento.' });
      return false;
    }

    if (!canApplyToGig(state, gigId)) {
      if (state.maxApplicationsReached) {
        set({
          toastMessage:
            'Limite de Overbooking atingido: você já se candidatou ao limite máximo de 3 vagas simultâneas.',
        });
      }
      return false;
    }

    const nextState = applyToGigReducer(state, gigId);
    set({
      gigs: nextState.gigs,
      ...computeApplicationsDerived(nextState.gigs),
    });

    // Simulação do aceite pelo contratante
    const randomDelay = Math.floor(Math.random() * 1500) + 3500;
    if (simulationTimers[gigId]) clearTimeout(simulationTimers[gigId]);
    simulationTimers[gigId] = setTimeout(() => {
      const currentState = get();
      // Cancela outros timers
      Object.values(simulationTimers).forEach(clearTimeout);
      for (const k of Object.keys(simulationTimers)) delete simulationTimers[k];

      const confirmedState = confirmGigAcceptance(currentState, gigId);
      set({
        gigs: confirmedState.gigs,
        activeShift: confirmedState.activeShift,
        toastMessage: confirmedState.toastMessage,
        ...computeApplicationsDerived(confirmedState.gigs),
      });
    }, randomDelay);

    return true;
  },

  cancelApplication: (gigId: string) => {
    if (simulationTimers[gigId]) {
      clearTimeout(simulationTimers[gigId]);
      delete simulationTimers[gigId];
    }

    const currentGigs = get().gigs.map((g) =>
      g.id === gigId ? { ...g, status: 'disponivel' as ApplicationStatus } : g
    );

    set({
      gigs: currentGigs,
      ...computeApplicationsDerived(currentGigs),
    });
  },

  performCheckIn: (qrCode: string): { success: boolean; message: string } => {
    const { activeShift } = get();
    if (!activeShift) {
      return { success: false, message: 'Nenhum turno ativo encontrado.' };
    }

    const result = validateQrCodeCheckIn(activeShift, qrCode);
    if (!result.success || !result.updatedShift) {
      return { success: false, message: result.message };
    }

    set({
      activeShift: result.updatedShift,
      toastMessage: result.message,
    });

    return { success: true, message: result.message };
  },

  requestCheckOut: () => {
    const { activeShift } = get();
    if (!activeShift) return;

    const nextShift = requestCheckOutState(activeShift);
    set({
      activeShift: nextShift,
      toastMessage: 'Check-out solicitado. Janela de contestação de 2h iniciada.',
    });

    if (autoCheckoutTimer) clearTimeout(autoCheckoutTimer);

    autoCheckoutTimer = setTimeout(() => {
      const current = get();
      if (!current.activeShift || current.activeShift.status !== 'checkout_pendente_aprovacao') {
        return;
      }
      const approved = autoApproveCheckOutState(current.activeShift);
      set({
        activeShift: approved,
        toastMessage: 'Janela encerrada sem contestação: Taxa Aprovada - PIX Agendado!',
      });
    }, 5500);
  },

  submitVenueReview: (_review: VenueReviewPayload) => {
    const { activeShift } = get();
    if (!activeShift) return;

    set({
      activeShift: {
        ...activeShift,
        status: 'pix_agendado',
        pixScheduledDate: 'Hoje às 03:00 (Repasse Automático)',
      },
    });
  },

  finishAndReceive: () => {
    const { gigs } = get();
    const resetGigs = gigs.map((g) =>
      g.status === 'confirmado' ? { ...g, status: 'disponivel' as ApplicationStatus } : g
    );
    set({
      activeShift: null,
      gigs: resetGigs,
      ...computeApplicationsDerived(resetGigs),
    });
  },

  clearToast: () => set({ toastMessage: null }),

  setGigs: (gigs: FreelancerGigItem[]) =>
    set({ gigs, ...computeApplicationsDerived(gigs) }),

  setActiveShift: (activeShift: ActiveShiftState | null) => set({ activeShift }),

  setToastMessage: (toastMessage: string | null) => set({ toastMessage }),

  resetToDefaults: () => {
    Object.values(simulationTimers).forEach(clearTimeout);
    for (const k of Object.keys(simulationTimers)) delete simulationTimers[k];
    if (autoCheckoutTimer) clearTimeout(autoCheckoutTimer);

    set({
      gigs: INITIAL_FREELANCER_GIGS,
      activeShift: null,
      toastMessage: null,
      ...computeApplicationsDerived(INITIAL_FREELANCER_GIGS),
    });
  },
}));

// Alias de retrocompatibilidade para componentes que consom o hook de fluxo
export const useFreelancerGigFlow = useFreelancerFlowStore;
