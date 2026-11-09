export type ApplicationStatus =
  | 'disponivel'
  | 'candidatado'
  | 'confirmado'
  | 'cancelado'
  | 'recusado';

export type ShiftStatus =
  | 'aguardando_checkin'
  | 'em_turno'
  | 'checkout_pendente_aprovacao'
  | 'pix_agendado'
  | 'finalizado';

export interface FreelancerGigItem {
  id: string;
  venueName: string;
  role: 'Bartender' | 'Garçom' | 'Hostess' | 'Copeiro' | 'Recepcionista';
  neighborhood: string;
  shiftTime: string; // Ex: "19:00 - 01:00"
  rate: number; // Ex: 250
  rateFormatted: string; // Ex: "R$ 250,00"
  status: ApplicationStatus;
  appliedAt?: number;
}

export interface ActiveShiftState {
  gigId: string;
  venueName: string;
  role: string;
  rate: number;
  rateFormatted: string;
  status: ShiftStatus;
  checkInTimestamp?: number;
  checkOutTimestamp?: number;
  autoCheckoutDeadline?: number; // Timestamp da janela de 2h
  pixScheduledDate?: string;
}

export interface VenueReviewPayload {
  gigId: string;
  rating: number; // 1 a 5 estrelas
  tags: string[];
  feedbackNotes?: string;
}
