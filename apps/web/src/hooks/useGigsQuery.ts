import { useQuery } from '@tanstack/react-query';
import type { GigOffer, Profession } from '@trampotaxa/shared';

// Chaves de cache centralizadas
export const QUERY_KEYS = {
  gigs: ['gigs'] as const,
  activeGig: (id?: string) => ['gig', id || 'active'] as const,
  earnings: ['earnings'] as const,
};

interface ApiGigItem {
  id: string;
  title: string;
  roleRequired: string;
  description: string;
  hourlyRate: number;
  estimatedTotal: number;
  shiftStart: string;
  shiftEnd: string;
  vacancies: number;
  status: number;
  venue?: {
    id: string;
    name: string;
    address: string;
    neighborhood: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}

// Mapeador para transformar entidades do PostgreSQL no contrato GigOffer consumido pelo mapa e cards
function mapApiGigToGigOffer(g: ApiGigItem, index: number): GigOffer {
  const startTime = new Date(g.shiftStart).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(g.shiftEnd).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const profession: Profession =
    g.roleRequired.toLowerCase().includes('garçom') || g.roleRequired.toLowerCase().includes('garcom')
      ? 'Garçom'
      : g.roleRequired.toLowerCase().includes('hostess')
      ? 'Hostess'
      : 'Bartender';

  return {
    id: g.id,
    profession,
    venueName: g.venue?.name || 'Bistrô do Batel',
    rating: 4.9,
    neighborhood: g.venue?.neighborhood || 'Batel',
    distance: `${(1.2 + (index * 0.4)).toFixed(1)} km`,
    rate: g.estimatedTotal,
    rateFormatted: `R$ ${g.estimatedTotal.toFixed(2).replace('.', ',')}`,
    shiftTime: `${startTime} - ${endTime}`,
    shiftDuration: '6 horas de turno',
    microtraining: {
      title: 'Regras de Atendimento e Dress Code',
      rulesTitle: 'Apresentação no Estabelecimento',
      description: g.description || 'Traje all black, pontualidade de 15 minutos e atendimento cordial.',
    },
    coords: {
      x: 35 + ((index * 17) % 50),
      y: 40 + ((index * 13) % 45),
    },
    latLng: {
      lat: g.venue?.latitude || -25.4411,
      lng: g.venue?.longitude || -49.2831,
    },
    active: g.status === 0,
  };
}

// Serviço assíncrono para buscar lista de taxas/vagas diretamente do PostgreSQL via /api/gigs
export async function fetchGigs(): Promise<GigOffer[]> {
  try {
    const res = await fetch('/api/gigs');
    if (res.ok) {
      const apiGigs: ApiGigItem[] = await res.json();
      if (Array.isArray(apiGigs) && apiGigs.length > 0) {
        return apiGigs.map((g, idx) => mapApiGigToGigOffer(g, idx));
      }
    }
  } catch {
    // Se a API falhar ou estiver offline, usa fallback
  }

  // Fallback para os dados canônicos mockados em caso de falha transitória
  if (import.meta.env.DEV) {
    const { mockGigs } = await import('@trampotaxa/shared/mocks');
    return [...mockGigs];
  }
  return [];
}

// Hook React Query para listagem e radar de taxas
export function useGigsQuery() {
  return useQuery({
    queryKey: QUERY_KEYS.gigs,
    queryFn: fetchGigs,
    staleTime: 10 * 1000, // 10s para refletir rápido novas vagas criadas
    retry: 1,
  });
}

// Hook React Query para detalhes do turno ativo
export function useActiveGigQuery(gigId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.activeGig(gigId),
    queryFn: async (): Promise<GigOffer> => {
      if (gigId) {
        try {
          const res = await fetch(`/api/gigs/${gigId}`);
          if (res.ok) {
            const g = await res.json();
            return mapApiGigToGigOffer(g, 0);
          }
        } catch {
          // fallback
        }
      }

      if (import.meta.env.DEV) {
        const { mockGigs } = await import('@trampotaxa/shared/mocks');
        const found = gigId ? mockGigs.find((g) => g.id === gigId) : undefined;
        if (found) return found;
        const fallback = mockGigs[0];
        if (fallback) return fallback;
      }
      throw new Error(`No gig data available${gigId ? ` for id "${gigId}"` : ''}`);
    },
    staleTime: 10 * 1000,
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
      await new Promise((resolve) => setTimeout(resolve, 200));
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
