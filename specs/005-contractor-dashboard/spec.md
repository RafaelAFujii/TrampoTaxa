# Feature Specification: Dashboard Principal do Contratante

**Feature Branch**: `005-contractor-dashboard`  
**Created**: 2026-10-29  
**Status**: In Progress (Phase: Specify/Plan)  
**Input**: Solicitação do usuário: "Na tela principal do contratante quero que seja um dashboard com o resumo das informações das quantidades de taxas abertas, relatorio da semana, quantidade de mensagens pendentes e outras coisas que achar necessario"

---

## 1. Visão Geral & Objetivos de Produto

O **Contratante** (gerente de bar, restaurante ou casa noturna) precisa de uma visão executiva consolidada ao acessar a plataforma, em vez de ser direcionado imediatamente para a listagem crua de vagas. O novo **Dashboard do Contratante** atuará como centro de comando operacional e financeiro, permitindo:

1. Visualizar instantaneamente o status das taxas de hoje e da semana (abertas, em andamento, preenchidas).
2. Monitorar a saúde financeira com o **Relatório da Semana** (gastos com taxas, horas contratadas e gráfico comparativo diário dos últimos 7 dias).
3. Visualizar e acessar prontamente **mensagens pendentes** e conversas ativas com freelancers e candidatos.
4. Identificar alertas operacionais críticos (ex: turnos de hoje sem freelancer confirmado) e agir com 1 clique.
5. Acessar atalhos estratégicos: "Criar Nova Taxa", "Triagem de Candidatos", "Relatório Financeiro Completo".

---

## 2. User Scenarios & Testing *(mandatory)*

### User Story 1 - Visão Executiva e Status das Taxas (Priority: P1)
Como gerente de um restaurante em Curitiba, quero visualizar na tela inicial o total de vagas abertas, vagas preenchidas e turnos ativos hoje, para que eu saiba imediatamente se a minha operação noturna está com o salão e bar cobertos.

- **Independent Test**: Ao acessar a conta com perfil Contratante, a tela inicial renderiza os cards de KPI com o número de taxas abertas, preenchidas e taxa de comparecimento calculadas reativamente a partir de `ContractorContext`.
- **Critérios de Aceite**:
  1. Card de "Taxas Abertas" exibindo o total de vagas abertas e vagas pendentes de candidatos.
  2. Card de "Candidaturas Pendentes" com badge de alerta se houver profissionais aguardando aprovação.
  3. Card de "Turnos de Hoje" com contagem de profissionais escalados para o plantão.

---

### User Story 2 - Relatório Financeiro e Operacional da Semana (Priority: P1)
Como contratante, preciso de um resumo financeiro da semana corrente que apresente o investimento total em taxas, a média por turno e um gráfico visual dos últimos 7 dias, para controle orçamentário sem precisar exportar planilhas.

- **Independent Test**: O bloco de relatório semanal soma as taxas finalizadas/programadas na semana, calcula o custo médio por hora/turno e exibe gráfico diário proporcional com barras interativas.
- **Critérios de Aceite**:
  1. Valor monetário formatado em BRL (`R$ X.XXX,XX`) com comparativo percentual em relação à semana anterior.
  2. Gráfico diário simplificado dos últimos 7 dias (Seg a Dom) destacando os dias de pico de movimento gastronômico (ex: Sexta e Sábado).
  3. Total de horas cobertas pela equipe autônoma.

---

### User Story 3 - Mensagens Pendentes & Central de Comunicação Rápida (Priority: P2)
Como gerente com escala ativa, quero saber se há mensagens não lidas ou pendentes de freelancers sobre chegada, uniformes ou dúvidas do turno, podendo responder com agilidade diretamente do dashboard.

- **Independent Test**: O dashboard calcula mensagens com status pendente ou de candidatos ativos, exibindo um card com preview das últimas mensagens e botão direto para abrir a tela de chat.
- **Critérios de Aceite**:
  1. Contador de mensagens pendentes/ativas em destaque no topo do dashboard.
  2. Lista das últimas 3 conversas com avatar, nome do freelancer, vaga correspondente, snippet do texto e timestamp.
  3. Clique na mensagem redireciona para a aba `/contractor/chat` com a conversa ativa selecionada.

---

### User Story 4 - Alertas Críticos & Próximos Turnos (Sugestões de Alto Valor) (Priority: P2)
Como operador de salão, quero ver os próximos turnos agendados para as próximas 24 horas e alertas de risco operacional (ex: vaga aberta faltando poucas horas para o turno), para tomar ações preventivas imediatas.

- **Independent Test**: Se uma vaga estiver com status "Aberta" sem candidato para a data corrente, um card de alerta prioritário em âmbar/vermelho é destacado no topo com botão "Divulgar Taxa" ou "Aumentar Valor".
- **Critérios de Aceite**:
  1. Lista dos "Próximos Turnos de Hoje" com horário, cargo (Bartender, Garçom, Cozinheiro), nome do freelancer confirmado e status.
  2. Botão de atalho rápido para ligar (`tel:`) ou abrir chat com o freelancer escalado.

---

## 3. Arquitetura Técnica & Rotas

### 3.1. Novas Rotas e Navegação
- Rota principal do contratante: `/contractor/dashboard`
- Redirecionamento da raiz (`/`) e pós-login de contratante: aponta para `/contractor/dashboard` em vez de `/contractor/gigs`.
- Menu de Navegação (`AppLayout` e `BottomNavigation`):
  1. **Início / Dashboard** (`/contractor/dashboard`)
  2. **Minhas Vagas** (`/contractor/gigs`)
  3. **Publicar Vaga** (`/contractor/create`)
  4. **Mensagens** (`/contractor/chat`)
  5. **Relatórios** (`/contractor/reports`)

### 3.2. Estrutura de Componentes
- `apps/web/src/screens/contractor/ContractorDashboardScreen.tsx`: Tela principal contendo:
  - Header de Boas-Vindas com dados do estabelecimento e data atual.
  - Grade de KPIs rápidos (Taxas Abertas, Candidaturas Pendentes, Turnos Hoje, Gasto Semanal).
  - Alerta de Vagas Urgentes (se aplicável).
  - Seção "Relatório da Semana" com gráfico de barras e comparativo.
  - Seção "Próximos Turnos de Hoje" com cards de freelancers confirmados.
  - Seção "Mensagens Pendentes" com últimas interações e acesso direto.
  - Ações Rápidas de rodapé ou topo (Publicar Vaga, Filtrar Candidatos, Ver Relatórios).

### 3.3. Contratos e Modelos Compartilhados
- Aproveitamento integral dos tipos `@trampotaxa/shared` (`ContractorGig`, `ChatMessage`, `ContractorKPIs`, `formatCurrency`).
- Compatibilidade 100% com os testes existentes do monorepo.
