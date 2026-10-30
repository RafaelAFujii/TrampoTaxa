# Checklist de Requisitos: Dashboard do Contratante

Este checklist garante que a implementação atende a todas as diretrizes funcionais, de usabilidade, de segurança e de arquitetura do TrampoTaxa.

## 1. Requisitos Funcionais do Usuário
- [ ] O dashboard deve ser a tela de entrada padrão ao logar como Contratante.
- [ ] Exibir a contagem exata de **Taxas Abertas** com detalhamento de vagas disponíveis.
- [ ] Exibir o bloco de **Relatório da Semana**:
  - [ ] Total investido em taxas nos últimos 7 dias / semana atual.
  - [ ] Média de valor por turno pago.
  - [ ] Total de horas cobertas por freelancers contratados.
  - [ ] Gráfico/barras comparativas dos dias da semana.
- [ ] Exibir o bloco de **Mensagens Pendentes**:
  - [ ] Contador de mensagens não lidas ou pendentes com freelancers.
  - [ ] Pré-visualização das mensagens mais recentes com remetente, timestamp e vaga associada.
  - [ ] Ação de clique levando diretamente à conversa correspondente.
- [ ] Exibir **Próximos Turnos**:
  - [ ] Lista de turnos do dia/semana com nome do profissional escalado, função e horário.
  - [ ] Botões rápidos para iniciar chat ou chamada telefônica.
- [ ] Exibir **Alertas Operacionais**:
  - [ ] Aviso proativo quando houver taxa aberta sem candidatos para o turno da noite.
- [ ] Ações Rápidas:
  - [ ] Botão de destaque "Criar Nova Taxa".
  - [ ] Botão "Ver Todas as Vagas".
  - [ ] Botão "Ver Relatório Completo".

## 2. Requisitos Técnicos & Arquitetura
- [ ] Criar `ContractorDashboardScreen.tsx` de forma modular e tipada em TypeScript.
- [ ] Integrar no `routes.tsx` sob o caminho `/contractor/dashboard`.
- [ ] Atualizar redirecionamento de entrada (`IndexRedirect` e `LoginRouteGate`) para `/contractor/dashboard`.
- [ ] Atualizar navegação do contratante (`AppLayout.tsx` e abas) com link para Dashboard.
- [ ] Reutilizar lógica existente de `ContractorContext` sem duplicar estados ou corromper mocks.
- [ ] Garantir 100% de responsividade (Mobile, Tablet e Desktop).
- [ ] Validação estática: `bun run lint` com 0 erros.
- [ ] Executar suíte de testes do monorepo: `bun test` com 73+ testes passando.
- [ ] Compilação de produção: `compile_applet` bem-sucedida.
