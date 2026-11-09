# Feature Specification: Documentação Modular e Matriz de READMEs do Monorepo

**Feature Branch**: `008-modular-readme-documentation`

**Created**: 2026-11-08

**Status**: Completed (Implementação 100% Concluída)

**Input**: User description: "Realize atualização do readme, e tambem para cada modulo(arquivo) crie um readme explicando aquele arquivo"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sincronização do README Principal do Monorepo (Priority: P1)

Como desenvolvedor, tech lead ou auditor de arquitetura acessando a raiz do repositório TrampoTaxa, preciso que o `README.md` principal esteja completamente atualizado com as versões atuais dos pacotes, visão de arquitetura monorepo unificada (incluindo o novo backend `apps/server` com tRPC, Drizzle ORM e SQL Server, além de `apps/web`, `apps/mobile` e `packages/shared`), matriz de badges de qualidade, instruções de instalação via Bun, tabela de comandos operacionais e mapa de navegação para a documentação interna de cada subsistema.

**Why this priority**: O `README.md` raiz é o cartão de visita, o ponto de entrada único para novos engenheiros e a base de governança do projeto. Com a introdução do backend e dos fluxos cruzados contratante/freelancer, o README precisa refletir o estado de arte real do ecossistema.

**Independent Test**: Um engenheiro lê exclusivamente o `README.md` raiz e consegue compreender a topologia de 4 workspaces (`apps/web`, `apps/mobile`, `apps/server`, `packages/shared`), entender o fluxo de dados ponta a ponta (Web/Mobile -> tRPC/REST -> Drizzle -> DB) e navegar diretamente aos READMEs específicos de cada módulo.

**Acceptance Scenarios**:
1. **Given** o repositório na raiz, **When** o usuário abre o `README.md`, **Then** visualiza a arquitetura monorepo completa incluindo o backend `apps/server`, diagramas de fluxo, guia de execução local com Bun, e links para as documentações de cada subdiretório.
2. **Given** comandos desatualizados ou incompletos, **When** auditados contra os scripts de `package.json`, **Then** todos os comandos listados refletem a realidade dos scripts de teste, lint, build e geração de tipos.

---

### User Story 2 - Documentação Modular dos Workspaces Principais (Priority: P2)

Como engenheiro atuando em um pacote específico (`apps/web`, `apps/mobile`, `apps/server`, `packages/shared`), preciso encontrar em cada raiz de módulo um `README.md` detalhado explicando a responsabilidade única daquele pacote, decisões técnicas fundamentais, variáveis de ambiente necessárias, scripts de build/test, convenções de código e matriz de dependências internas e externas.

**Why this priority**: Garante o isolamento de domínio e a autonomia de times (ou agentes autônomos) trabalhando em diferentes partes do monorepo sem vazamento de contexto.

**Independent Test**: Um desenvolvedor acessa individualmente qualquer uma das 4 pastas (`apps/web/README.md`, `apps/mobile/README.md`, `apps/server/README.md`, `packages/shared/README.md`) e obtém todas as informações necessárias para operar, testar e debugar aquele workspace de forma autônoma.

**Acceptance Scenarios**:
1. **Given** o diretório `apps/server`, **When** o usuário consulta seu `README.md`, **Then** encontra a documentação do servidor Fastify/tRPC v11, configuração do Drizzle ORM com SQL Server/MSSQL, routers de API (`auth`, `gigs`, `chat`, `contractor`, `freelancer`), schemas de banco e comandos de seed/migração.
2. **Given** o diretório `packages/shared`, **When** o usuário consulta seu `README.md`, **Then** encontra a explicação dos modelos canônicos, gerador Orval de hooks React Query, validadores fiscais e dataset de Curitiba.
3. **Given** o diretório `apps/web`, **When** o usuário consulta seu `README.md`, **Then** encontra a arquitetura SPA/PWA com Vite, sistema de roteamento RBAC, gerenciamento de contexto e mapa vetorial com clustering.
4. **Given** o diretório `apps/mobile`, **When** o usuário consulta seu `README.md`, **Then** encontra as instruções do ecossistema Expo SDK 51 / React Native, Metro Bundler monorepo e abas de navegação.

---

### User Story 3 - Matriz de Documentação Granular por Submódulos e Camadas (Priority: P3)

Como mantenedor de código ou revisor de pull requests, preciso que cada submódulo arquitetural chave (camadas de `src/routers`, `src/db`, `src/trpc` no server; `src/components`, `src/context`, `src/screens`, `src/routes`, `src/hooks` na web e mobile; e `src/api`, `src/types`, `src/utils`, `src/data` no shared) possua um `README.md` dedicado descrevendo o papel de cada arquivo contido naquele diretório, seus contratos de entrada/saída, dependências críticas e diretrizes de modificação segura.

**Why this priority**: Atende explicitamente à solicitação de documentação modular a nível de arquivo/módulo ("para cada modulo(arquivo) crie um readme explicando aquele arquivo"), eliminando pontos cegos no código e acelerando o onboarding em qualquer camada específica.

**Independent Test**: Qualquer arquivo ou subpasta navegada no GitHub ou na IDE conta com um `README.md` local detalhando a função específica de cada arquivo presente.

**Acceptance Scenarios**:
1. **Given** a pasta `apps/server/src/routers/`, **When** inspecionada, **Then** há um `README.md` explicando cada router (`auth.ts`, `gigs.ts`, `chat.ts`, `contractor.ts`, `freelancer.ts`, `index.ts`).
2. **Given** a pasta `apps/server/src/db/`, **When** inspecionada, **Then** há um `README.md` detalhando `client.ts`, `schema.ts`, `seed.ts` e o ciclo de vida do Drizzle.
3. **Given** a pasta `apps/web/src/context/` e `apps/mobile/src/context/`, **When** inspecionadas, **Then** possuem READMEs explicando o ciclo de vida dos contextos `AuthContext`, `FreelancerFlowContext`, `ContractorContext` e estados offline.
4. **Given** as pastas de telas e componentes, **When** inspecionadas, **Then** contam com documentação de layout, responsividade e desacoplamento de lógica.

---

## Edge Cases

- **Módulos com arquivos gerados ou de configuração estática**: Arquivos como `package.json`, `tsconfig.json`, `vite.config.ts`, `metro.config.js` devem ser explicados no README do módulo correspondente, sem sobrecarregar com arquivos `.md` desnecessários em pastas temporárias como `dist` ou `.expo`.
- **Prevenção de arquivos órfãos**: O índice principal no `README.md` raiz deve manter hiperlinks relativos navegáveis para todos os novos READMEs criados nos subdiretórios.
- **Conformidade com a Constituição**: Nenhum segredo ou chave de API real deve ser incluído na documentação; apenas referências a variáveis de ambiente de `.env.example`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O `README.md` raiz DEVE ser atualizado para incorporar o novo workspace `apps/server` (tRPC v11 + Drizzle ORM + SQL Server), atualizando a contagem de testes, diagramas de arquitetura e tabela de comandos de execução.
- **FR-002**: O `README.md` raiz DEVE conter uma seção de "Guia de Navegação de Módulos" (Architecture Map) com links para todos os READMEs setoriais do monorepo.
- **FR-003**: DEVE ser criado ou atualizado o `README.md` em cada um dos 4 workspaces: `apps/server/README.md`, `apps/web/README.md`, `apps/mobile/README.md` e `packages/shared/README.md`.
- **FR-004**: DEVEM ser criados READMEs explicativos de submódulos nas camadas de backend (`apps/server/src/routers/README.md`, `apps/server/src/db/README.md`, `apps/server/src/trpc/README.md`).
- **FR-005**: DEVEM ser criados READMEs explicativos de submódulos no pacote compartilhado (`packages/shared/src/api/README.md`, `packages/shared/src/data/README.md`, `packages/shared/src/types/README.md`, `packages/shared/src/utils/README.md`).
- **FR-006**: DEVEM ser criados READMEs explicativos de submódulos no frontend web (`apps/web/src/components/README.md`, `apps/web/src/context/README.md`, `apps/web/src/screens/README.md`, `apps/web/src/routes/README.md`, `apps/web/src/hooks/README.md`).
- **FR-007**: DEVEM ser criados READMEs explicativos de submódulos no app mobile (`apps/mobile/src/api/README.md`, `apps/mobile/src/context/README.md`, `apps/mobile/src/navigation/README.md`, `apps/mobile/src/screens/README.md`).
- **FR-008**: Cada README modular DEVE detalhar: (1) Propósito da pasta/módulo, (2) Tabela descritiva de cada arquivo contido com suas respectivas responsabilidades, (3) Contratos de entrada e saída, (4) Boas práticas de manutenção e testes associados.

### Key Entities

- **Workspaces do Monorepo**: `apps/web`, `apps/mobile`, `apps/server`, `packages/shared`.
- **Submódulos Arquiteturais**: Routers, Database, Contexts, Screens, Navigation, Hooks, Shared Contracts, Utilities.
- **Matriz de Documentação**: Estrutura hierárquica e viva interligada por hiperlinks markdown.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos workspaces e submódulos estruturais documentados com READMEs padronizados e sem links quebrados.
- **SC-002**: Cada arquivo de código do monorepo possui uma entrada descritiva clara em seu respectivo README modular.
- **SC-003**: 0 violações de governança ou vazamento de credenciais na documentação.
- **SC-004**: Tempo de onboarding técnico de um novo engenheiro reduzido a menos de 5 minutos para entender onde qualquer funcionalidade reside no monorepo.

---

## Assumptions

- O projeto utiliza Bun como runtime e gerenciador de pacotes principal.
- A arquitetura segue Spec-Driven Development, mantendo `specs/` como fonte da verdade.
- A fase de implementação só deve ser iniciada após liberação explícita do usuário (`implement`), preservando o Scope Guard.
