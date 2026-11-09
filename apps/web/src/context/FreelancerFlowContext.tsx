import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  FreelancerGigItem,
  ActiveShiftState,
  VenueReviewPayload,
  canApplyToGig,
  applyToGigReducer,
  confirmGigAcceptance,
  validateQrCodeCheckIn,
  requestCheckOutState,
  autoApproveCheckOutState,
  MAX_CONCURRENT_APPLICATIONS,
  FreelancerFlowState,
} from '@trampotaxa/shared';

export interface FreelancerFlowContextData {
  gigs: FreelancerGigItem[];
  activeShift: ActiveShiftState | null;
  activeApplicationsCount: number;
  maxApplicationsReached: boolean;
  applyToGig: (gigId: string) => boolean;
  cancelApplication: (gigId: string) => void;
  performCheckIn: (qrCode: string) => { success: boolean; message: string };
  requestCheckOut: () => void;
  submitVenueReview: (review: VenueReviewPayload) => void;
  finishAndReceive: () => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const INITIAL_WEB_MOCK_GIGS: FreelancerGigItem[] = [
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

const FreelancerFlowContext = createContext<FreelancerFlowContextData | null>(null);

const STORAGE_GIGS_KEY = 'trampotaxa_web_freelancer_gigs';
const STORAGE_SHIFT_KEY = 'trampotaxa_web_freelancer_shift';

export const FreelancerFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FreelancerFlowState>(() => {
    try {
      const storedGigs = localStorage.getItem(STORAGE_GIGS_KEY);
      const storedShift = localStorage.getItem(STORAGE_SHIFT_KEY);
      return {
        gigs: storedGigs ? JSON.parse(storedGigs) : INITIAL_WEB_MOCK_GIGS,
        activeShift: storedShift ? JSON.parse(storedShift) : null,
        toastMessage: null,
      };
    } catch {
      return {
        gigs: INITIAL_WEB_MOCK_GIGS,
        activeShift: null,
        toastMessage: null,
      };
    }
  });

  const simulationTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const autoCheckoutTimer = useRef<NodeJS.Timeout | null>(null);

  // Sincroniza persistência
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GIGS_KEY, JSON.stringify(state.gigs));
      if (state.activeShift) {
        localStorage.setItem(STORAGE_SHIFT_KEY, JSON.stringify(state.activeShift));
      } else {
        localStorage.removeItem(STORAGE_SHIFT_KEY);
      }
    } catch {}
  }, [state.gigs, state.activeShift]);

  const activeApplicationsCount = state.gigs.filter((g) => g.status === 'candidatado').length;
  const maxApplicationsReached = activeApplicationsCount >= MAX_CONCURRENT_APPLICATIONS;

  /**
   * 1. PILAR OVERBOOKING CONTROLADO:
   * Limita a 3 candidaturas concorrentes no mesmo horário.
   */
  const applyToGig = (gigId: string): boolean => {
    if (state.activeShift !== null) {
      setState((prev) => ({
        ...prev,
        toastMessage: 'Você já possui um turno confirmado ou em andamento.',
      }));
      return false;
    }

    if (!canApplyToGig(state, gigId)) {
      if (maxApplicationsReached) {
        setState((prev) => ({
          ...prev,
          toastMessage:
            'Limite de Overbooking atingido: você já se candidatou ao limite máximo de 3 vagas simultâneas.',
        }));
      }
      return false;
    }

    setState((prev) => applyToGigReducer(prev, gigId));

    // Simulação do Contratante aceitando a vaga em 3 a 5 segundos
    const randomDelay = Math.floor(Math.random() * 1500) + 3500;
    simulationTimers.current[gigId] = setTimeout(() => {
      handleContractorAccepted(gigId);
    }, randomDelay);

    return true;
  };

  /**
   * Disparo reativo do Aceite:
   * Confirma a vaga aprovada e cancela automaticamente as outras concorrentes.
   */
  const handleContractorAccepted = (winningGigId: string) => {
    // Limpa outros temporizadores de candidatura
    Object.values(simulationTimers.current).forEach(clearTimeout);
    simulationTimers.current = {};

    setState((prev) => {
      const updated = confirmGigAcceptance(prev, winningGigId);
      return updated;
    });
  };

  const cancelApplication = (gigId: string) => {
    if (simulationTimers.current[gigId]) {
      clearTimeout(simulationTimers.current[gigId]);
      delete simulationTimers.current[gigId];
    }

    setState((prev) => ({
      ...prev,
      gigs: prev.gigs.map((g) => (g.id === gigId ? { ...g, status: 'disponivel' } : g)),
    }));
  };

  /**
   * 2. PILAR SCANNER QR CODE MESTRE:
   * Validação de Check-in presencial no estabelecimento ("QR_MESTRE_123").
   */
  const performCheckIn = (qrCode: string): { success: boolean; message: string } => {
    if (!state.activeShift) {
      return { success: false, message: 'Nenhum turno ativo encontrado.' };
    }

    const result = validateQrCodeCheckIn(state.activeShift, qrCode);
    if (!result.success || !result.updatedShift) {
      return { success: false, message: result.message };
    }

    setState((prev) => ({
      ...prev,
      activeShift: result.updatedShift!,
      toastMessage: result.message,
    }));

    return { success: true, message: result.message };
  };

  /**
   * AUTO-CHECKOUT (Janela de 2h de contestação):
   * Simulação acelerada para validação de produto.
   */
  const requestCheckOut = () => {
    if (!state.activeShift) return;

    const nextShift = requestCheckOutState(state.activeShift);
    setState((prev) => ({
      ...prev,
      activeShift: nextShift,
      toastMessage: 'Check-out solicitado. Janela de contestação de 2h iniciada.',
    }));

    if (autoCheckoutTimer.current) clearTimeout(autoCheckoutTimer.current);

    autoCheckoutTimer.current = setTimeout(() => {
      setState((prev) => {
        if (!prev.activeShift || prev.activeShift.status !== 'checkout_pendente_aprovacao') {
          return prev;
        }
        const approved = autoApproveCheckOutState(prev.activeShift);
        return {
          ...prev,
          activeShift: approved,
          toastMessage: 'Janela encerrada sem contestação: Taxa Aprovada - PIX Agendado!',
        };
      });
    }, 5500);
  };

  /**
   * 3. PILAR UX DOPAMINA CATIVADA:
   * Avaliação de 5 estrelas sem loading e liberação imediata do extrato.
   */
  const submitVenueReview = (_review: VenueReviewPayload) => {
    setState((prev) => {
      if (!prev.activeShift) return prev;
      return {
        ...prev,
        activeShift: {
          ...prev.activeShift,
          status: 'pix_agendado',
          pixScheduledDate: 'Hoje às 03:00 (Repasse Automático)',
        },
      };
    });
  };

  const finishAndReceive = () => {
    setState((prev) => ({
      ...prev,
      activeShift: null,
      gigs: prev.gigs.map((g) => (g.status === 'confirmado' ? { ...g, status: 'disponivel' } : g)),
    }));
  };

  const clearToast = () => {
    setState((prev) => ({ ...prev, toastMessage: null }));
  };

  useEffect(() => {
    return () => {
      Object.values(simulationTimers.current).forEach(clearTimeout);
      if (autoCheckoutTimer.current) clearTimeout(autoCheckoutTimer.current);
    };
  }, []);

  return (
    <FreelancerFlowContext.Provider
      value={{
        gigs: state.gigs,
        activeShift: state.activeShift,
        activeApplicationsCount,
        maxApplicationsReached,
        applyToGig,
        cancelApplication,
        performCheckIn,
        requestCheckOut,
        submitVenueReview,
        finishAndReceive,
        toastMessage: state.toastMessage,
        clearToast,
      }}
    >
      {children}
    </FreelancerFlowContext.Provider>
  );
};

export const useFreelancerGigFlow = (): FreelancerFlowContextData => {
  const context = useContext(FreelancerFlowContext);
  if (!context) {
    throw new Error('useFreelancerGigFlow deve ser utilizado dentro de um FreelancerFlowProvider');
  }
  return context;
};
