# Tasks: Jornada do Freelancer TrampoTaxa

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)  
**Status**: Completed

---

## Sequenciamento de Execução

- [x] **T001**: Criar tipos e contratos compartilhados em `packages/shared/src/types/freelancerFlow.ts` para candidaturas, turnos e avaliações.
- [x] **T002**: Implementar `FreelancerFlowContext.tsx` e `useFreelancerGigFlow.ts` em `apps/mobile/src/` com:
  - Limite de 3 candidaturas concorrentes (Overbooking Controlado).
  - Simulação de aceite pelo contratante via timeout com cancelamento em cascata das outras candidaturas.
  - Alerta/toast de feedback reativo.
- [x] **T003**: Implementar componente de scanner de QR Code (`MasterQrScannerModal.tsx`) com interface visual de mira e botão simulador do `"QR_MESTRE_123"`.
- [x] **T004**: Implementar fluxo de Check-in e Check-out com temporizador de auto-aprovação de contestação (2 horas / simulação de teste) atualizando para "Aprovada - PIX Agendado" em `ActiveShiftScreen.tsx`.
- [x] **T005**: Implementar tela/modal de avaliação do estabelecimento de 5 estrelas (`VenueReviewModal.tsx`) com animação direta sem carregamento intermediário.
- [x] **T006**: Implementar tela de Relatório de Ganhos com foco visual em verde neon (`#00E676`), tipografia de alto impacto e exibição do PIX liberado/agendado (`HighDopamineEarningsScreen.tsx`).
- [x] **T007**: Integrar navegação no `RootNavigator.tsx` com aba Turno Ativo, conectar `MapScreen.tsx` e validar suíte TDD em `freelancerFlowState.test.ts`.
- [x] **T008**: Validar lints, tipagens TypeScript e compilação de todo o monorepo.
