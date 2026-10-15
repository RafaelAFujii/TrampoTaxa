import { useQuery } from '@tanstack/react-query';
import { mockGigs, GigOffer } from '@trampotaxa/shared';

// Chaves de cache centralizadas
export const QUERY_KEYS = {
  gigs: ['gigs'] as const,
  activeGig: (id?: string) => ['gig', id || 'active'] as const,
  earnings: ['earnings'] as const,
};

// Serviço assíncrono para buscar lista de taxas/vagas disponíveis
export async function fetchGigs(): Promise<GigOffer[]> {
  // Simula latência de rede assíncrona realista (300ms)
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...mockGigs];
}

// Hook React Query para listagem e radar de taxas
export function useGigsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.gigs,
    queryFn: fetchGigs,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
}

// Hook React Query para detalhes do turno ativo
export function useActiveGigQuery(gigId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.activeGig(gigId),
    queryFn: async (): Promise<GigOffer> => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (gigId) {
        const found = mockGigs.find((g) => g.id === gigId);
        if (found) return found;
      }
      return mockGigs[0];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export interface EarningsData {
  today: number;
  week: number;
  month: number;
  completedGigsCount: number;
  history: Array<{
    id: string;
    venueName: string;
    role: string;
    date: string;
    amount: number;
    status: 'Concluído' | 'Em Processamento';
    pixKey: string;
  }>;
}

// Hook React Query para extrato e faturamento
export function useEarningsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.earnings,
    queryFn: async (): Promise<EarningsData> => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        today: 250,
        week: 1120,
        month: 3840,
        completedGigsCount: 14,
        history: [
          {
            id: 'earn-1',
            venueName: 'Boteco São Jorge',
            role: 'Bartender',
            date: 'Hoje, 02:30',
            amount: 250,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: 'earn-2',
            venueName: 'Taj Bar Curitiba',
            role: 'Bartender',
            date: 'Ontem, 03:00',
            amount: 320,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: 'earn-3',
            venueName: 'Nuu Nikkei',
            role: 'Garçom',
            date: '10 Out, 23:45',
            amount: 280,
            status: 'Concluído',
            pixKey: '41999990000',
          },
          {
            id: 'earn-4',
            venueName: 'Bar do Alemão',
            role: 'Bartender',
            date: '08 Out, 01:15',
            amount: 270,
            status: 'Concluído',
            pixKey: '41999990000',
          },
        ],
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
