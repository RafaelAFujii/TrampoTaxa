// Tipagens centrais e domínios
export * from './types/index';
export * from './types/contractor';

// Utilitários e Stores de Estado Zustand (Zero Context API)
export * from './utils/formatters';
export * from './utils/gigs';
export * from './utils/freelancerFlowState';
export * from './utils/contractorState';

// Contratos e Tipos do Servidor tRPC Type-Safe
export type { AppRouter } from '../../../apps/server/src/routers/index';
