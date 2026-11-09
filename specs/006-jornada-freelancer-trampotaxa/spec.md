# Feature Specification: Jornada do Freelancer TrampoTaxa (Overbooking, QR Scanner, Auto-Checkout e UX Dopamina)

**Feature Branch**: `006-jornada-freelancer-trampotaxa`  
**Created**: 2026-11-05  
**Status**: Specified / Planned (Phase: Specify/Plan)  
**Input**: Requisitos de UI/UX e gerenciamento de estado para os 3 pilares fundamentais do fluxo Freelancer no TrampoTaxa:
1. Overbooking Controlado (limite de 3 candidaturas concorrentes com auto-resolução por primeiro aceite e cancelamento reativo).
2. Scanner QR Code Mestre + Auto-Checkout (leitura simulada em 1 clique e janela de 2h para aprovação tácita / PIX agendado).
3. UX Dopamina Cativada (avaliação 5 estrelas obrigatória sem loaders chatos, transição comemorativa direta para relatório financeiro em verde neon #00E676).

---

## 1. Visão Geral & Objetivos de Produto

O **TrampoTaxa** conecta freelancers do setor de hospitalidade (bartenders, garçons, recepcionistas, etc.) a contratantes de bares, restaurantes e casas noturnas. No cenário de eventos, a dinâmica de contratação exige velocidade extrema, garantia mútua de presença e fechamento financeiro imediato via PIX.

Esta especificação define os 3 pilares de UX/UI e estado no app mobile (`apps/mobile` em React Native/Expo com TypeScript):

### Pilar 1: Overbooking Controlado (State Management Mockado)
- **Regra de Negócio**: O freelancer pode se candidatar a no máximo 3 vagas no mesmo horário ou data.
- **Simulação de Contratante**: Ao aplicar para vagas, uma rotina de `setTimeout` simula a aprovação por um contratante.
- **Auto-Cancelamento Concorrente**: Assim que uma vaga é confirmada, todas as outras candidaturas ativas no mesmo período são canceladas e o usuário é notificado via alerta/toast ("Você foi contratado! Suas outras candidaturas foram canceladas.").

### Pilar 2: Scanner QR Code Mestre + Auto-Checkout (UI & Lógica de Tempo)
- **Check-in no Local**: Validação presencial via leitura de QR Code físico fornecido pelo gerente (mock com botão de depuração/simulação rápida com payload fixo `QR_MESTRE_123`).
- **Auto-Checkout de 2h**: Ao solicitar check-out no fim do turno, se o gerente não contestar dentro de 2 horas (ou timeout curto simulado em ambiente de teste), o pagamento é aprovado tacitamente e o status migra para "Aprovada - PIX Agendado".

### Pilar 3: UX "Dopamina Cativada" (Animação e Pico de Recompensa)
- **Avaliação 5 Estrelas Obrigatória**: Coleta de feedback do estabelecimento (1 a 5 estrelas + tags de experiência) sem atrito.
- **Transição Fluida Sem Loading**: Ao submeter a avaliação, em vez de spinners genéricos, há um micro-feedback de celebração imediato migrando para o "Relatório de Ganhos".
- **Pico Visual no Extrato**: Destaque agressivo em verde neon (`#00E676`), tipografia pesada, badge de "PIX Agendado/Liberado" e resumo de valor ganho, gerando alívio e satisfação após horas de turno.

---

## 2. Requisitos Funcionais & Critérios de Aceite

### RF-01: Gestão de Candidaturas e Overbooking
- Manter coleção de candidaturas com estados: `'disponivel' | 'candidatado' | 'confirmado' | 'cancelado' | 'recusado'`.
- Bloquear candidatura se o usuário já tiver 3 candidaturas ativas simultâneas (`candidatado`).
- Disparar temporizador simulando o aceite de um dos contratantes (entre 3 e 6 segundos).
- Ao confirmar uma vaga, transicionar as demais para `'cancelado'` e emitir feedback sonoro/tátil/visual.

### RF-02: Check-in / Check-out com QR Code Mestre
- Interface com visor de câmera simulado (frame com mira central e linhas de escaneamento animadas).
- Botão discreto de debug para passar instantaneamente o payload `"QR_MESTRE_123"`.
- Estado do turno: `'a_caminho' | 'presente_em_turno' | 'checkout_solicitado' | 'pix_agendado' | 'concluido'`.
- Temporizador de auto-aprovação de contestação do gerente (janela de 2h / simulado em 5s no mock).

### RF-03: Avaliação do Local e Feedback de Recompensa
- Modal / Tela com seletor interativo de 1 a 5 estrelas.
- O botão "Confirmar e Receber" só se torna clicável com nota preenchida (>= 1).
- Disparo de animação de sucesso (escala e fade) sem tela de espera.
- Redirecionamento instantâneo para a tela de Relatório de Ganhos com foco no valor ganho em verde neon.

---

## 3. Arquitetura Técnica & Isolamento de Contratos

- **Monorepo Coeso**:
  - Tipos e interfaces compartilhados em `packages/shared/src/types/freelancerFlow.ts`.
  - Hook e Store de estado mockado em `apps/mobile/src/hooks/useFreelancerGigFlow.ts` e `apps/mobile/src/context/FreelancerFlowContext.tsx`.
  - Telas e componentes em `apps/mobile/src/screens/` e `apps/mobile/src/components/`.
- **Evolução para tRPC / TanStack Query**:
  - O hook encapsula as mutações de modo que, no futuro, substituir `setTimeout` por `trpc.gigs.apply.useMutation()` e `trpc.gigs.checkout.useMutation()` seja transparente para os componentes de UI.
