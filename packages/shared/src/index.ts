// Tipagens centrais e domínios
export * from './types/index';
export * from './types/contractor';

// Utilitários de formatação e validação fiscal
export * from './utils/formatters';
export * from './utils/gigs';
export * from './utils/freelancerFlowState';

// API gerada a partir da especificação OpenAPI (React Query + Fetch)
export * as api from './api';
export * from './api/endpoints';

// Contratos e Tipos do Servidor tRPC Type-Safe
export type { AppRouter } from '../../../apps/server/src/routers/index';
