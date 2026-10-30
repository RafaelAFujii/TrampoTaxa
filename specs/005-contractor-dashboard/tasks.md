# Tasks: Dashboard Principal do Contratante

**Feature**: [spec.md](./spec.md) | **Checklist**: [checklists/requirements.md](./checklists/requirements.md)  
**Status**: Completed

---

## Sequenciamento de Execução

- [x] **T001**: Criar o componente de tela `ContractorDashboardScreen.tsx` em `apps/web/src/screens/contractor/`:
  - Header de boas-vindas com nome do estabelecimento e status operacional.
  - Cards de KPIs principais: Taxas Abertas, Candidaturas Pendentes, Turnos de Hoje, Total Investido na Semana.
  - Card de Alerta de Urgência para vagas próximas do horário sem confirmação.
  - Seção de Relatório Semanal com métricas de horas, investimento e gráfico em barras dos últimos 7 dias.
  - Seção de Próximos Turnos com cards de freelancers confirmados, horário e atalhos de contato.
  - Seção de Mensagens Pendentes com pré-visualização das últimas conversas e link direto para o chat.
  - Ações Rápidas (Criar Taxa, Ver Vagas, Ver Relatórios, Dados do Estabelecimento).
- [x] **T002**: Registrar a rota `/contractor/dashboard` no roteador `apps/web/src/routes/routes.tsx` e configurar os redirecionamentos de `IndexRedirect` e `LoginRouteGate` para apontar para a nova tela inicial do contratante.
- [x] **T003**: Atualizar a navegação principal do contratante em `apps/web/src/layouts/AppLayout.tsx` e no `BottomNavigation.tsx` para incluir a aba "Dashboard / Início" como primeira opção do menu.
- [x] **T004**: Atualizar testes unitários de rotas e navegação em `apps/web/src/routes/role-navigation.test.ts` e suíte do contratante para cobrir a rota `/contractor/dashboard`.
- [x] **T005**: Executar `bun run lint`, `bun test` e `compile_applet` para certificar integridade completa, zero regressões e código livre de débitos técnicos.
