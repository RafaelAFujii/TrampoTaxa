import { create } from 'zustand';
import type {
  ContractorGig,
  FreelancerApplicant,
  ContractorEvaluation,
  ChatMessage,
  ContractorKPIs,
  ContractorGigStatus,
} from '../types/contractor';
import { formatCurrency } from './formatters';
import { INITIAL_CONTRACTOR_GIGS, INITIAL_CHAT_MESSAGES } from '../data/mockContractorData';

export interface CreateGigData {
  title: string;
  role: string;
  category: ContractorGig['category'];
  date: string;
  dateFormatted?: string;
  startTime: string;
  endTime: string;
  rate: number;
  rateFormatted?: string;
  dressCode: string;
  rulesAndNotes: string;
  venueName?: string;
  neighborhood?: string;
  address?: string;
  vacancies?: number;
}

export function calculateContractorKPIs(gigs: ContractorGig[]): ContractorKPIs {
  const completed = gigs.filter((g) => g.status === 'Finalizada');
  const totalInvested = completed.reduce((acc, curr) => acc + curr.rate, 0);

  const hiredIds = new Set<string>();
  gigs.forEach((g) => {
    if (g.approvedFreelancerId) {
      hiredIds.add(g.approvedFreelancerId);
    }
    g.applicants.forEach((a) => {
      if (a.status === 'Aprovado') {
        hiredIds.add(a.id);
      }
    });
  });

  const averageRate = completed.length > 0 ? totalInvested / completed.length : 215;

  return {
    totalInvested,
    totalInvestedFormatted: formatCurrency(totalInvested),
    completedGigsCount: completed.length,
    hiredFreelancersCount: hiredIds.size || 3,
    averageRateFormatted: formatCurrency(averageRate),
    punctualityScore: '99.2%',
  };
}

export interface ContractorState {
  gigs: ContractorGig[];
  messages: ChatMessage[];
  kpis: ContractorKPIs;
  activeGigId: string | null;
  setActiveGigId: (id: string | null) => void;
  setGigs: (gigs: ContractorGig[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addGig: (data: CreateGigData) => ContractorGig;
  updateGigStatus: (gigId: string, status: ContractorGigStatus) => void;
  approveApplicant: (gigId: string, applicantId: string) => void;
  rejectApplicant: (gigId: string, applicantId: string) => void;
  submitEvaluation: (gigId: string, evaluation: ContractorEvaluation) => void;
  toggleFavoriteFreelancer: (freelancerId: string) => void;
  sendMessage: (gigId: string, text: string) => void;
  sendFreelancerMessage: (gigId: string, text: string, freelancerName?: string) => void;
  getMessagesForGig: (gigId: string) => ChatMessage[];
  getGigById: (gigId: string) => ContractorGig | undefined;
  getApplicantById: (applicantId: string) => FreelancerApplicant | undefined;
  confirmFreelancerCheckIn: (gigId: string) => void;
  approveCheckoutImmediately: (gigId: string) => void;
  disputeCheckout: (gigId: string, reason: string) => void;
  resetToDefaults: () => void;
}

export const useContractorStore = create<ContractorState>((set, get) => ({
  gigs: INITIAL_CONTRACTOR_GIGS,
  messages: INITIAL_CHAT_MESSAGES,
  kpis: calculateContractorKPIs(INITIAL_CONTRACTOR_GIGS),
  activeGigId: null,

  setActiveGigId: (id: string | null) => set({ activeGigId: id }),

  setGigs: (gigs: ContractorGig[]) =>
    set({
      gigs,
      kpis: calculateContractorKPIs(gigs),
    }),

  setMessages: (messages: ChatMessage[]) => set({ messages }),

  addGig: (data: CreateGigData): ContractorGig => {
    const newId = `cgig-${Date.now()}`;
    const newGig: ContractorGig = {
      id: newId,
      title: data.title,
      role: data.role,
      category: data.category,
      date: data.date,
      dateFormatted: data.dateFormatted || data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      rate: data.rate,
      rateFormatted: data.rateFormatted || formatCurrency(data.rate),
      dressCode: data.dressCode,
      rulesAndNotes: data.rulesAndNotes,
      venueName: data.venueName || 'Bistrô do Batel',
      neighborhood: data.neighborhood || 'Batel Soho',
      address: data.address || 'Av. do Batel, 1540 - Curitiba/PR',
      vacancies: data.vacancies || 1,
      status: 'Aberta',
      applicants: [
        {
          id: `free-${Date.now()}`,
          name: 'Renan Castro',
          avatarUrl:
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
          profession: `${data.role} Especialista`,
          rating: 4.88,
          totalGigsCompleted: 24,
          punctualityRate: '98%',
          specialties: ['Agilidade', 'Postura Profissional', 'Disponibilidade Imediata'],
          status: 'Pendente',
          appliedAt: 'Recém-candidatado',
          phone: '(41) 98877-6655',
          bio: `Profissional dedicado com ampla experiência em turnos gastronômicos como ${data.role}.`,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const nextGigs = [newGig, ...get().gigs];
    set({
      gigs: nextGigs,
      kpis: calculateContractorKPIs(nextGigs),
    });
    return newGig;
  },

  updateGigStatus: (gigId: string, status: ContractorGigStatus) => {
    const nextGigs = get().gigs.map((g) => (g.id === gigId ? { ...g, status } : g));
    set({
      gigs: nextGigs,
      kpis: calculateContractorKPIs(nextGigs),
    });
  },

  approveApplicant: (gigId: string, applicantId: string) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;

      const updatedApplicants = gig.applicants.map((app) => {
        if (app.id === applicantId) {
          return { ...app, status: 'Aprovado' as const };
        }
        return app;
      });

      return {
        ...gig,
        status: 'Preenchida' as const,
        approvedFreelancerId: applicantId,
        applicants: updatedApplicants,
      };
    });

    const targetGig = get().gigs.find((g) => g.id === gigId);
    const targetApplicant = targetGig?.applicants.find((a) => a.id === applicantId);
    const applicantName = targetApplicant ? targetApplicant.name : 'Profissional';

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      gigId,
      senderId: 'contractor-batel',
      senderName: 'Gerência do Estabelecimento',
      senderRole: 'Contratante',
      text: `Olá ${applicantName}! Sua candidatura para a vaga "${targetGig?.title || 'Taxa'}" foi aprovada! Qualquer dúvida sobre o ponto de encontro ou regras do dress code, pode falar por aqui.`,
      timestamp: 'Agora',
      read: true,
    };

    set({
      gigs: nextGigs,
      messages: [...get().messages, welcomeMsg],
      kpis: calculateContractorKPIs(nextGigs),
    });
  },

  rejectApplicant: (gigId: string, applicantId: string) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;
      return {
        ...gig,
        applicants: gig.applicants.map((app) =>
          app.id === applicantId ? { ...app, status: 'Recusado' as const } : app
        ),
      };
    });

    set({ gigs: nextGigs });
  },

  submitEvaluation: (gigId: string, evaluation: ContractorEvaluation) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;
      return {
        ...gig,
        status: 'Finalizada' as const,
        evaluation,
      };
    });

    set({
      gigs: nextGigs,
      kpis: calculateContractorKPIs(nextGigs),
    });
  },

  toggleFavoriteFreelancer: (freelancerId: string) => {
    const nextGigs = get().gigs.map((gig) => ({
      ...gig,
      applicants: gig.applicants.map((app) =>
        app.id === freelancerId ? { ...app, isFavorite: !app.isFavorite } : app
      ),
    }));

    set({ gigs: nextGigs });
  },

  sendMessage: (gigId: string, text: string) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      gigId,
      senderId: 'contractor-batel',
      senderName: 'Gerência do Estabelecimento',
      senderRole: 'Contratante',
      text: text.trim(),
      timestamp: 'Agora',
      read: true,
    };

    set((state) => ({ messages: [...state.messages, newMsg] }));

    // Simulação de resposta do freelancer
    const gig = get().gigs.find((g) => g.id === gigId);
    const approvedApplicant = gig?.applicants.find(
      (a) => a.id === gig.approvedFreelancerId || a.status === 'Aprovado'
    );
    const freelancerName = approvedApplicant?.name || 'Gabriel Silva';
    const freelancerId = approvedApplicant?.id || 'free-1';

    setTimeout(() => {
      const simulatedReplies = [
        'Perfeito! Estarei aí no horário combinado, com o dress code completo. Muito obrigado!',
        'Combinado! Anotei todas as observações. Chegarei 15 minutos antes pela portaria de serviço.',
        'Entendido perfeitamente! Já organizei meu material de trabalho e estarei pronto.',
        'Obrigado pelo aviso! Pode contar comigo, qualquer novidade aviso por aqui também.',
      ];
      const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        gigId,
        senderId: freelancerId,
        senderName: freelancerName,
        senderRole: 'Freelancer',
        text: randomReply,
        timestamp: 'Agora mesmo',
        read: false,
      };

      set((state) => ({ messages: [...state.messages, replyMsg] }));
    }, 1500);
  },

  sendFreelancerMessage: (
    gigId: string,
    text: string,
    freelancerName = 'Gabriel Silva'
  ) => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      gigId,
      senderId: 'free-user',
      senderName: freelancerName,
      senderRole: 'Freelancer',
      text: text.trim(),
      timestamp: 'Agora',
      read: true,
    };

    set((state) => ({ messages: [...state.messages, newMsg] }));

    setTimeout(() => {
      const gig = get().gigs.find((g) => g.id === gigId);
      const venueName = gig?.venueName || 'Gerência do Salão';

      const simulatedReplies = [
        `Olá ${freelancerName}! Mensagem recebida. Pode vir pela entrada lateral de serviço e procurar pelo Carlos.`,
        'Combinado! Estamos aguardando você. Se precisar guardar sua mochila, temos armários liberados no vestiário.',
        'Tudo certo! Acesso liberado com o segurança da portaria. Até já!',
        'Recebido! Qualquer dúvida sobre o salão ou comanda, pode me procurar no balcão central.',
        'Perfeito! Bom turno, qualquer novidade ou imprevisto nos avise por aqui.',
      ];
      const randomReply =
        simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        gigId,
        senderId: 'manager-batel',
        senderName: `Gerência (${venueName})`,
        senderRole: 'Contratante',
        text: randomReply,
        timestamp: 'Agora mesmo',
        read: false,
      };

      set((state) => ({ messages: [...state.messages, replyMsg] }));
    }, 1200);
  },

  getMessagesForGig: (gigId: string) => {
    return get().messages.filter((m) => m.gigId === gigId);
  },

  getGigById: (gigId: string) => {
    return get().gigs.find((g) => g.id === gigId);
  },

  getApplicantById: (applicantId: string) => {
    for (const g of get().gigs) {
      const found = g.applicants.find((a) => a.id === applicantId);
      if (found) return found;
    }
    return undefined;
  },

  confirmFreelancerCheckIn: (gigId: string) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;
      return {
        ...gig,
        checkInTimestamp: Date.now(),
        shiftPhase: 'em_turno' as const,
      };
    });

    set({ gigs: nextGigs });
  },

  approveCheckoutImmediately: (gigId: string) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;
      return {
        ...gig,
        status: 'Finalizada' as const,
        shiftPhase: 'pix_aprovado' as const,
        checkOutTimestamp: Date.now(),
      };
    });

    const approveMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      gigId,
      senderId: 'contractor-batel',
      senderName: 'Gerência do Estabelecimento',
      senderRole: 'Contratante',
      text: 'Taxa conferida e aprovada pela gerência! PIX liberado com sucesso. Obrigado pelo turno!',
      timestamp: 'Agora',
      read: true,
    };

    set({
      gigs: nextGigs,
      messages: [...get().messages, approveMsg],
      kpis: calculateContractorKPIs(nextGigs),
    });
  },

  disputeCheckout: (gigId: string, reason: string) => {
    const nextGigs = get().gigs.map((gig) => {
      if (gig.id !== gigId) return gig;
      return {
        ...gig,
        shiftPhase: 'contestado' as const,
        disputeReason: reason,
      };
    });

    const disputeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      gigId,
      senderId: 'contractor-batel',
      senderName: 'Gerência do Estabelecimento',
      senderRole: 'Contratante',
      text: `Atenção: A gerência registrou uma contestação sobre este turno: "${reason}". O repasse automático está em análise.`,
      timestamp: 'Agora',
      read: true,
    };

    set({
      gigs: nextGigs,
      messages: [...get().messages, disputeMsg],
    });
  },

  resetToDefaults: () => {
    set({
      gigs: INITIAL_CONTRACTOR_GIGS,
      messages: INITIAL_CHAT_MESSAGES,
      kpis: calculateContractorKPIs(INITIAL_CONTRACTOR_GIGS),
      activeGigId: null,
    });
  },
}));

// Export compatível com o hook useContractor
export const useContractor = useContractorStore;
