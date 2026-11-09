# Implementation Plan: Jornada do Freelancer TrampoTaxa

**Feature**: [spec.md](./spec.md)  
**Status**: Planned  

---

## 1. Arquitetura de Estado & Mocking

Para permitir que a aplicação funcione de forma independente e reativa sem backend, estruturamos o estado em um modelo desacoplado via Hook e Context Provider (`FreelancerFlowProvider`). O hook expõe uma API análoga aos hooks do TanStack Query / tRPC:

```ts
interface UseFreelancerGigFlowReturn {
  activeGigs: FreelancerGig[];
  activeShift: ActiveShift | null;
  applicationsCount: number;
  maxApplicationsReached: boolean;
  applyToGig: (gigId: string) => Promise<boolean>;
  cancelApplication: (gigId: string) => void;
  performCheckIn: (qrCodePayload: string) => Promise<{ success: boolean; message: string }>;
  requestCheckOut: () => Promise<void>;
  submitVenueReview: (review: VenueReview) => Promise<void>;
  resetShift: () => void;
}
```

---

## 2. Estrutura de Diretórios Proposta

```text
packages/shared/src/
  └── types/
      └── freelancerFlow.ts          # Contratos e tipos compartilhados de vagas, estados e avaliações

apps/mobile/src/
  ├── context/
  │   └── FreelancerFlowContext.tsx  # Contexto com persistência em memória e temporizadores de auto-resolução
  ├── hooks/
  │   └── useFreelancerGigFlow.ts    # Custom hook de consumo seguro com regras de negócio e validações
  ├── components/
  │   ├── flow/
  │   │   ├── GigApplicationCard.tsx # Card de vaga com botão de candidatura e badge de status
  │   │   ├── MasterQrScannerModal.tsx # Scanner visual da câmera com retículo e botão debug de QR Mestre
  │   │   └── VenueReviewModal.tsx   # Modal de 5 estrelas sem loading com animação comemorativa
  │   └── feedback/
  │       └── ToastNotification.tsx  # Toast in-app para alertas de "Você foi contratado!"
  └── screens/
      ├── ActiveShiftScreen.tsx      # Tela de controle do turno ativo (Check-in / Check-out com auto-aprovação 2h)
      └── HighDopamineEarningsScreen.tsx # Tela de Relatório de Ganhos com verde neon (#00E676) e impacto visual
```

---

## 3. Estratégia de Transição para Backend Real (tRPC / React Query)

1. **Separação de Camadas**: A UI nunca dispara temporizadores diretamente; ela apenas invoca ações no hook (`applyToGig`, `performCheckIn`, `requestCheckOut`).
2. **Substituição Cirúrgica**: Quando a API REST ou rotas tRPC estiverem disponíveis, a implementação interna do hook substitui a mutação local por `trpc.useMutation` mantendo a assinatura idêntica.
3. **Fail-Closed**: Validações de overbooking (máximo 3) são testadas e validadas tanto no cliente quanto no futuro backend.
