export type ContractorGigCategory = 'Turno Normal' | 'Cobertura de Emergência' | 'Evento Especial';

export type ContractorGigStatus =
  'Aberta' | 'Aguardando Confirmação' | 'Preenchida' | 'Finalizada' | 'Cancelada';

export type ApplicantStatus = 'Pendente' | 'Aprovado' | 'Recusado';

export interface FreelancerApplicant {
  id: string;
  name: string;
  avatarUrl: string;
  profession: string;
  rating: number;
  totalGigsCompleted: number;
  punctualityRate: string;
  specialties: string[];
  status: ApplicantStatus;
  appliedAt: string;
  phone: string;
  bio?: string;
  isFavorite?: boolean;
}

export interface ContractorEvaluation {
  rating: number; // 1 a 5
  feedback: string;
  tags: string[];
  isFavorite: boolean;
  evaluatedAt: string;
  evaluatedBy: string;
}

export interface ContractorGig {
  id: string;
  title: string;
  role: string; // "Bartender", "Garçom", "Recepcionista", etc.
  category: ContractorGigCategory;
  date: string; // "2026-10-24" ou "Hoje", "Amanhã"
  dateFormatted: string; // "Sexta, 24 de Outubro"
  startTime: string; // "19:00"
  endTime: string; // "01:00"
  rate: number; // e.g. 250
  rateFormatted: string; // "R$ 250,00"
  dressCode: string; // "Camisa preta lisa, calça jeans escura, sapato fechado"
  rulesAndNotes: string; // "Chegar 15 minutos antes para alinhamento..."
  venueName: string; // "Bistrô do Batel"
  neighborhood: string; // "Batel Soho"
  address: string; // "Av. Batel, 1540 - Curitiba"
  vacancies: number;
  status: ContractorGigStatus;
  applicants: FreelancerApplicant[];
  approvedFreelancerId?: string;
  evaluation?: ContractorEvaluation;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  gigId: string;
  senderId: string;
  senderName: string;
  senderRole: 'Contratante' | 'Freelancer';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ContractorKPIs {
  totalInvested: number;
  totalInvestedFormatted: string;
  completedGigsCount: number;
  hiredFreelancersCount: number;
  averageRateFormatted: string;
  punctualityScore: string;
}
