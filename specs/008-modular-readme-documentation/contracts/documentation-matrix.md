# Contrato da Matriz de Documentação (Directory to README Mapping)

Este contrato estabelece a correspondência formal entre os diretórios/arquivos do monorepo TrampoTaxa e os seus respectivos arquivos de documentação `README.md`.

## 1. Workspaces de Nível Superior

| Caminho do Workspace | Arquivo de Documentação | Responsabilidade Central |
| :--- | :--- | :--- |
| `/` (Raiz) | `/README.md` | Visão holística do monorepo, topologia de workspaces, comandos globais Bun, fluxo de dados ponta a ponta |
| `/apps/server` | `/apps/server/README.md` | Backend Node/Fastify com tRPC v11, Drizzle ORM, banco SQL Server, endpoints e seeds |
| `/apps/web` | `/apps/web/README.md` | Frontend Web SPA & PWA com React 19, Vite, mapas geoespaciais e fluxos Freelancer/Contratante |
| `/apps/mobile` | `/apps/mobile/README.md` | Aplicativo móvel nativo Expo SDK 51, React Native, Metro Bundler, autenticação móvel e telas |
| `/packages/shared` | `/packages/shared/README.md` | Contratos OpenAPI 3.0, geração de hooks via Orval, utilitários fiscais e tipos canônicos |

---

## 2. Submódulos do Backend (`apps/server`)

| Submódulo | Arquivo de Documentação | Arquivos Cobertos e Explicados |
| :--- | :--- | :--- |
| `apps/server/src/db` | `apps/server/src/db/README.md` | `client.ts` (conexão Drizzle pool MSSQL/Postgres/SQLite), `schema.ts` (definição de tabelas, relações e tipos inferidos), `seed.ts` (população de dados de bares e usuários de Curitiba) |
| `apps/server/src/routers` | `apps/server/src/routers/README.md` | `index.ts` (agregação do AppRouter), `auth.ts` (login e registro com hashing), `gigs.ts` (listagem, criação e filtragem de vagas), `chat.ts` (mensageria de operação), `contractor.ts` (KPIs e gestão de contratantes), `freelancer.ts` (candidaturas e perfil do profissional) |
| `apps/server/src/trpc` | `apps/server/src/trpc/README.md` | `context.ts` (criação do contexto com token JWT e extração de usuário), `init.ts` (inicialização de routers, procedures públicas e protegidas por RBAC) |

---

## 3. Submódulos do Compartilhado (`packages/shared`)

| Submódulo | Arquivo de Documentação | Arquivos Cobertos e Explicados |
| :--- | :--- | :--- |
| `packages/shared/src/api` | `packages/shared/src/api/README.md` | `index.ts`, `endpoints/` (clientes de API gerados por tag OpenAPI), `model/` (interfaces TypeScript de payload e resposta geradas pelo Orval) |
| `packages/shared/src/data` | `packages/shared/src/data/README.md` | `mockGigs.ts` (vagas gastronômicas reais de Curitiba georreferenciadas), `mockContractorData.ts` (estabelecimentos e métricas financeiras) |
| `packages/shared/src/types` | `packages/shared/src/types/README.md` | `index.ts`, `contractor.ts` (interfaces e enums do perfil contratante), `freelancerFlow.ts` (máquina de estados do turno do freelancer) |
| `packages/shared/src/utils` | `packages/shared/src/utils/README.md` | `formatters.ts` (moeda BRL, CNPJ, telefone, data/hora), `freelancerFlowState.ts` (transições de estado seguras para turnos), `gigs.ts` (cálculo de distâncias geoespaciais e filtros) |

---

## 4. Submódulos do Frontend Web (`apps/web`)

| Submódulo | Arquivo de Documentação | Arquivos Cobertos e Explicados |
| :--- | :--- | :--- |
| `apps/web/src/components` | `apps/web/src/components/README.md` | `ErrorBoundary.tsx`, `MobileFrame.tsx`, `chat/` (ManagerChatModal), `flow/` (MasterQrScannerModal, VenueReviewModal), `map/` (GigMarker, MapDashboardScreen, MapPlaceholder), `navigation/` (BottomNavigation), `ui/` (PrimaryButton, ProfessionToggle, SocialButton, StatusBar, TextInput, HomeIndicator) |
| `apps/web/src/context` | `apps/web/src/context/README.md` | `AuthContext.tsx` (sessão JWT e RBAC), `ContractorContext.tsx` (estado operacional de vagas do contratante), `FreelancerFlowContext.tsx` (jornada de aceite, check-in e conclusão de turno) |
| `apps/web/src/hooks` | `apps/web/src/hooks/README.md` | `useFreelancerGigFlow.ts` (orquestração da jornada do freelancer), `useGigsQuery.ts` (consulta de vagas com suporte a cache e fallback) |
| `apps/web/src/routes` | `apps/web/src/routes/README.md` | `ProtectedRoute.tsx` (guarda de rotas autenticadas e autorizadas por papel), `routes.tsx` (árvore unificada de rotas do React Router) |
| `apps/web/src/screens` | `apps/web/src/screens/README.md` | Telas de Autenticação (`LoginScreen`, `CadastroScreen`), Freelancer (`MapDashboardScreen`, `ActiveGigScreen`, `EarningsScreen`, `GigOfferBottomSheet`), Perfil/Configurações (`ProfileScreen`, `SettingsScreen`) e Contratante (`contractor/*`) |

---

## 5. Submódulos do Aplicativo Móvel (`apps/mobile`)

| Submódulo | Arquivo de Documentação | Arquivos Cobertos e Explicados |
| :--- | :--- | :--- |
| `apps/mobile/src/api` | `apps/mobile/src/api/README.md` | `authenticatedFetch.ts` (cliente fetch com injeção automática de header Bearer JWT), `useAuthenticatedFetch.ts` (hook React para requisições seguras) |
| `apps/mobile/src/context` | `apps/mobile/src/context/README.md` | `AuthContext.tsx` (autenticação móvel), `FreelancerFlowContext.tsx` (fluxo de turno no mobile), `freelancerFlowState.ts` (máquina de estados nativa), `session.ts` (persistência segura de tokens) |
| `apps/mobile/navigation` | `apps/mobile/navigation/README.md` | `RootNavigator.tsx` (navegação por abas inferiores e stacks de autenticação), `authNavigation.ts` (redirecionamento baseado em sessão), `types.ts` (tipagem estrita de rotas e parâmetros de navegação) |
| `apps/mobile/src/screens` | `apps/mobile/src/screens/README.md` | Telas nativas de Freelancer (`MapScreen`, `ActiveShiftScreen`, `EarningsScreen`, `HighDopamineEarningsScreen`, `ProfileScreen`) e Telas nativas de Contratante (`ContractorGigsScreen`, `CreateGigScreen`, `ContractorReportsScreen`, `ContractorChatScreen`) |
