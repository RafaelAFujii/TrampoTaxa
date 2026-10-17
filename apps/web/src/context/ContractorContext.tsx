import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ContractorGig,
  FreelancerApplicant,
  ContractorEvaluation,
  ChatMessage,
  ContractorKPIs,
  ContractorGigStatus,
  formatCurrency,
} from '@trampotaxa/shared';

interface CreateGigData {
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

interface ContractorContextType {
  gigs: ContractorGig[];
  messages: ChatMessage[];
  kpis: ContractorKPIs;
  activeGigId: string | null;
  setActiveGigId: (id: string | null) => void;
  addGig: (data: CreateGigData) => ContractorGig;
  updateGigStatus: (gigId: string, status: ContractorGigStatus) => void;
  approveApplicant: (gigId: string, applicantId: string) => void;
  rejectApplicant: (gigId: string, applicantId: string) => void;
  submitEvaluation: (gigId: string, evaluation: ContractorEvaluation) => void;
  toggleFavoriteFreelancer: (freelancerId: string) => void;
  sendMessage: (gigId: string, text: string) => void;
  getMessagesForGig: (gigId: string) => ChatMessage[];
  getGigById: (gigId: string) => ContractorGig | undefined;
  getApplicantById: (applicantId: string) => FreelancerApplicant | undefined;
}

const ContractorContext = createContext<ContractorContextType | undefined>(undefined);

const GIGS_STORAGE_KEY = 'trampotaxa_contractor_gigs';
const MSGS_STORAGE_KEY = 'trampotaxa_contractor_messages';

export const ContractorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gigs, setGigs] = useState<ContractorGig[]>(() => {
    try {
      const stored = localStorage.getItem(GIGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(MSGS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [activeGigId, setActiveGigId] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let active = true;
    void import('@trampotaxa/shared/mocks')
      .then(({ INITIAL_CONTRACTOR_GIGS, INITIAL_CHAT_MESSAGES }) => {
        if (!active) return;
        setGigs((current) => (current.length ? current : INITIAL_CONTRACTOR_GIGS));
        setMessages((current) => (current.length ? current : INITIAL_CHAT_MESSAGES));
      })
      .catch((error: unknown) => {
        console.error('Failed to load development contractor fixtures', error);
      });

    return () => {
      active = false;
    };
  }, []);

  // Sincroniza persistência local
  useEffect(() => {
    try {
      localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(gigs));
    } catch {
      // Ignore
    }
  }, [gigs]);

  useEffect(() => {
    try {
      localStorage.setItem(MSGS_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Cálculo reativo de KPIs
  const kpis: ContractorKPIs = useMemo(() => {
    const completed = gigs.filter((g) => g.status === 'Finalizada');
    const totalInvested = completed.reduce((acc, curr) => acc + curr.rate, 0);

    // Contagem de freelancers únicos aprovados/contratados
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
  }, [gigs]);

  /**
   * Criação de nova vaga de taxa
   */
  const addGig = (data: CreateGigData): ContractorGig => {
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
        // Adiciona 1 candidato simulado imediato de alta qualidade para dinamismo
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

    setGigs((prev) => [newGig, ...prev]);
    return newGig;
  };

  /**
   * Atualização de status da vaga
   */
  const updateGigStatus = (gigId: string, status: ContractorGigStatus) => {
    setGigs((prev) => prev.map((g) => (g.id === gigId ? { ...g, status } : g)));
  };

  /**
   * Aprovação de freelancer candidato
   */
  const approveApplicant = (gigId: string, applicantId: string) => {
    setGigs((prev) =>
      prev.map((gig) => {
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
      })
    );

    // Envia mensagem inicial automática de boas-vindas no chat
    const targetGig = gigs.find((g) => g.id === gigId);
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

    setMessages((prev) => [...prev, welcomeMsg]);
  };

  /**
   * Recusa de candidato
   */
  const rejectApplicant = (gigId: string, applicantId: string) => {
    setGigs((prev) =>
      prev.map((gig) => {
        if (gig.id !== gigId) return gig;
        return {
          ...gig,
          applicants: gig.applicants.map((app) =>
            app.id === applicantId ? { ...app, status: 'Recusado' as const } : app
          ),
        };
      })
    );
  };

  /**
   * Submissão de avaliação de desempenho pós-evento
   */
  const submitEvaluation = (gigId: string, evaluation: ContractorEvaluation) => {
    setGigs((prev) =>
      prev.map((gig) => {
        if (gig.id !== gigId) return gig;
        return {
          ...gig,
          status: 'Finalizada' as const,
          evaluation,
        };
      })
    );
  };

  /**
   * Favoritar / Desfavoritar Freelancer
   */
  const toggleFavoriteFreelancer = (freelancerId: string) => {
    setGigs((prev) =>
      prev.map((gig) => ({
        ...gig,
        applicants: gig.applicants.map((app) =>
          app.id === freelancerId ? { ...app, isFavorite: !app.isFavorite } : app
        ),
      }))
    );
  };

  /**
   * Envio de mensagem com simulação de resposta do freelancer
   */
  const sendMessage = (gigId: string, text: string) => {
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

    setMessages((prev) => [...prev, newMsg]);

    // Resposta automática simulada do freelancer após 1.5s para demonstrar chat ativo
    const gig = gigs.find((g) => g.id === gigId);
    const approvedApplicant = gig?.applicants.find(
      (a) => a.id === gig.approvedFreelancerId || a.status === 'Aprovado'
    );
    const freelancerName = approvedApplicant?.name || 'Gabriel Silva';
    const freelancerId = approvedApplicant?.id || 'free-1';

    setTimeout(() => {
      const simulatedReplies = [
        `Perfeito! Estarei aí no horário combinado, com o dress code completo. Muito obrigado!`,
        `Combinado! Anotei todas as observações. Chegarei 15 minutos antes pela portaria de serviço.`,
        `Entendido perfeitamente! Já organizei meu material de trabalho e estarei pronto.`,
        `Obrigado pelo aviso! Pode contar comigo, qualquer novidade aviso por aqui também.`,
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

      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const getMessagesForGig = (gigId: string) => {
    return messages.filter((m) => m.gigId === gigId);
  };

  const getGigById = (gigId: string) => {
    return gigs.find((g) => g.id === gigId);
  };

  const getApplicantById = (applicantId: string) => {
    for (const g of gigs) {
      const found = g.applicants.find((a) => a.id === applicantId);
      if (found) return found;
    }
    return undefined;
  };

  return (
    <ContractorContext.Provider
      value={{
        gigs,
        messages,
        kpis,
        activeGigId,
        setActiveGigId,
        addGig,
        updateGigStatus,
        approveApplicant,
        rejectApplicant,
        submitEvaluation,
        toggleFavoriteFreelancer,
        sendMessage,
        getMessagesForGig,
        getGigById,
        getApplicantById,
      }}
    >
      {children}
    </ContractorContext.Provider>
  );
};

export const useContractor = (): ContractorContextType => {
  const context = useContext(ContractorContext);
  if (!context) {
    throw new Error('useContractor deve ser utilizado dentro de um ContractorProvider');
  }
  return context;
};
