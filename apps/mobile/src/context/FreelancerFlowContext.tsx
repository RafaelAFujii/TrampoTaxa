import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Alert } from 'react-native';
import type { FreelancerGigItem, ActiveShiftState, VenueReviewPayload } from '@trampotaxa/shared';
import {
  canApplyToGig,
  applyToGigReducer,
  confirmGigAcceptance,
  validateQrCodeCheckIn,
  requestCheckOutState,
  autoApproveCheckOutState,
  MAX_CONCURRENT_APPLICATIONS,
  type FreelancerFlowState,
} from './freelancerFlowState';

export interface FreelancerFlowContextData {
  gigs: FreelancerGigItem[];
  activeShift: ActiveShiftState | null;
  activeApplicationsCount: number;
  maxApplicationsReached: boolean;
  applyToGig: (gigId: string) => boolean;
  cancelApplication: (gigId: string) => void;
  performCheckIn: (qrCode: string) => boolean;
  requestCheckOut: () => void;
  submitVenueReview: (review: VenueReviewPayload) => void;
  finishAndReceive: () => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const INITIAL_MOCK_GIGS: FreelancerGigItem[] = [
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

export const FreelancerFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FreelancerFlowState>({
    gigs: INITIAL_MOCK_GIGS,
    activeShift: null,
    toastMessage: null,
  });

  const simulationTimers = useRef<Record<string, NodeJS.Timeout>>({});
  const autoCheckoutTimer = useRef<NodeJS.Timeout | null>(null);

  const activeApplicationsCount = state.gigs.filter((g) => g.status === 'candidatado').length;
  const maxApplicationsReached = activeApplicationsCount >= MAX_CONCURRENT_APPLICATIONS;

  /**
   * 1. PILAR OVERBOOKING CONTROLADO:
   * Limita a 3 candidaturas e agenda simulação do aceite do contratante.
   */
  const applyToGig = (gigId: string): boolean => {
    if (state.activeShift !== null) {
      Alert.alert('Turno Ativo', 'Você já possui um turno confirmado ou em andamento.');
      return false;
    }

    if (!canApplyToGig(state, gigId)) {
      if (maxApplicationsReached) {
        Alert.alert(
          'Limite de Candidaturas',
          'Você atingiu o limite de 3 candidaturas concorrentes no mesmo horário. Aguarde a resposta de um estabelecimento.'
        );
      }
      return false;
    }

    setState((prev) => applyToGigReducer(prev, gigId));

    // Simulação do aceite pelo Contratante entre 3.5 e 5 segundos
    const randomDelay = Math.floor(Math.random() * 1500) + 3500;
    simulationTimers.current[gigId] = setTimeout(() => {
      handleContractorAccepted(gigId);
    }, randomDelay);

    return true;
  };

  /**
   * Disparo reativo do Aceite:
   * Confirma a vaga aceita e cancela automaticamente as outras ativas.
   */
  const handleContractorAccepted = (winningGigId: string) => {
    // Limpa outros timers de candidatura
    Object.values(simulationTimers.current).forEach(clearTimeout);
    simulationTimers.current = {};

    setState((prev) => {
      const updated = confirmGigAcceptance(prev, winningGigId);
      if (updated.toastMessage) {
        Alert.alert('🎉 Você foi contratado!', updated.toastMessage);
      }
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
   * Valida check-in presencial no estabelecimento.
   */
  const performCheckIn = (qrCode: string): boolean => {
    if (!state.activeShift) return false;

    const result = validateQrCodeCheckIn(state.activeShift, qrCode);
    if (!result.success || !result.updatedShift) {
      Alert.alert('QR Code Inválido', result.message);
      return false;
    }

    setState((prev) => ({
      ...prev,
      activeShift: result.updatedShift!,
      toastMessage: result.message,
    }));

    Alert.alert('Check-in Confirmado', result.message);
    return true;
  };

  /**
   * AUTO-CHECKOUT (Janela de 2h de contestação):
   * Dispara o timer que simula a aprovação silenciosa por falta de contestação do gerente.
   */
  const requestCheckOut = () => {
    if (!state.activeShift) return;

    const nextShift = requestCheckOutState(state.activeShift);
    setState((prev) => ({
      ...prev,
      activeShift: nextShift,
      toastMessage: 'Check-out solicitado. Janela de contestação de 2h iniciada.',
    }));

    // Simulação do encerramento da janela (5.5s para fins de teste no app)
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
          toastMessage: 'Janela encerrada: Taxa Aprovada - PIX Agendado!',
        };
      });
      Alert.alert(
        'Taxa Aprovada!',
        'A janela de 2 horas encerrou sem contestação do gerente. Seu PIX foi agendado com sucesso!'
      );
    }, 5500);
  };

  /**
   * 3. PILAR UX DOPAMINA CATIVADA:
   * Avaliação de 5 estrelas e liberação direta de visualização do extrato.
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
