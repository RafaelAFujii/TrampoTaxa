# Feature Specification: Sincronização e Revisão Geral dos READMEs do Monorepo

**Feature Branch**: `003-docs-system-readme-sync`

**Created**: 2026-10-18

**Status**: In Progress

**Input**: User description: "revise o sistema e para realizar a atualizaçãos dos redme.md"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auditoria Técnica e Onboarding de Desenvolvedores (Priority: P1)

Como um novo desenvolvedor ou auditor técnico que clona o repositório TrampoTaxa, preciso encontrar no `README.md` raiz e nos READMEs de cada módulo (`apps/web`, `apps/mobile`, `packages/shared`, `apps/web/docs`) uma documentação viva e 100% fidedigna à arquitetura real do monorepo, para que eu possa instalar dependências com o gerenciador oficial (Bun), rodar a suíte completa de 91 testes automatizados e entender a topologia dos pacotes sem encontrar referências desatualizadas a comandos `npm`/`yarn` ou caminhos obsoletos.

**Why this priority**: Documentação em desacordo com o código causa erros de compilação, falhas no CI/CD e quebra de governança técnica. É a base de confiança do monorepo.

**Independent Test**: Um engenheiro sem conhecimento prévio consegue clonar o repositório, executar `bun install`, `bun test`, `bun run lint`, `bun run typecheck:mobile` e `bun run build:web` lendo exclusivamente o `README.md` raiz, obtendo 100% de sucesso.

**Acceptance Scenarios**:
1. **Given** um ambiente recém-clonado com Bun instalado, **When** o desenvolvedor executa os comandos documentados no README raiz, **Then** todos os comandos executam com código de retorno 0.
2. **Given** a leitura do `README.md` raiz e do `apps/web/README.md`, **When** o desenvolvedor busca pela arquitetura de interface, **Then** encontra a documentação atualizada sem os botões removidos de depuração ("Código" e alternador de perfil) e com a descrição da correção estrutural do mapa full-bleed (`h-screen min-h-0`).

---

### User Story 2 - Execução e Build Nativo do Aplicativo Móvel (Priority: P2)

Como um desenvolvedor mobile que precisa testar o aplicativo nativo no smartphone ou simular o build via EAS, preciso consultar o `apps/mobile/README.md` e encontrar as instruções exatas para inicialização do Metro Bundler via Bun Workspaces, os detalhes da navegação por abas nativas (`@react-navigation/bottom-tabs`) e os testes de tipagem (`bun run typecheck:mobile`).

**Why this priority**: O aplicativo móvel evoluiu de uma casca webview para um app React Native nativo com React Query e mapas; a documentação precisa refletir essa maturidade técnica.

**Independent Test**: Executar `bun run dev:mobile` e `bun run typecheck:mobile` seguindo as instruções de `apps/mobile/README.md`, confirmando a resolução correta de `@trampotaxa/shared`.

**Acceptance Scenarios**:
1. **Given** o diretório `apps/mobile`, **When** o desenvolvedor consulta o README, **Then** encontra os comandos baseados em `bun run` e a documentação das 3 abas nativas (Radar, Ganhos e Perfil sem botão de teste).

---

### User Story 3 - Governança dos Contratos de API e Qualidade Contínua (Priority: P3)

Como um arquiteto de software ou engenheiro de DevOps, preciso consultar `packages/shared/README.md` e `apps/web/docs/README.md` para entender como a especificação OpenAPI 3.0 gera automaticamente clientes e hooks do React Query através do Orval, como o pipeline de CI/CD do GitHub Actions opera com Bun e Node 24, e como as portas de segurança contra falhas (fail-closed release risk gates) garantem a estabilidade do sistema.

**Why this priority**: Garante conformidade com o padrão Contract-Driven Development (CDD) e documenta a evolução da suíte para 91 testes automatizados.

**Independent Test**: Executar `bun run api:generate` e `bun test` e confrontar a saída com a documentação em `packages/shared/README.md`.

**Acceptance Scenarios**:
1. **Given** a documentação em `packages/shared/README.md`, **When** o desenvolvedor verifica a tabela de endpoints e regras fiscais, **Then** encontra o espelhamento exato do `openapi.yaml` e dos validadores Módulo 11 de CNPJ.

---

### Edge Cases

- **Ausência de Chave Google Maps:** Documentação deve explicitar que o sistema entra em modo de fallback vetorial interativo (`MinimalVectorMap`) com clustering geoespacial local (`use-supercluster`) sem quebrar a tela.
- **Diferenças de Versão Node.js:** Explicar claramente que o CI mobile utiliza Node.js 24 explicitamente para evitar avisos de depreciação do Node 20 no Expo Action.
- **Ambiente Offline (PWA):** Explicar como as políticas do Service Worker (`NetworkFirst` e `CacheFirst`) garantem a consulta de taxas em áreas com conectividade instável.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O `README.md` raiz DEVE documentar o monorepo Bun completo (`apps/web`, `apps/mobile`, `packages/shared`), destacando as métricas de 91 testes aprovados, 0% de débito técnico e integração contínua.
- **FR-002**: O `README.md` raiz DEVE listar os comandos oficiais de desenvolvimento utilizando `bun` (`bun install`, `bun run dev:web`, `bun run dev:mobile`, `bun test`, `bun run lint`, `bun run typecheck:mobile`, `bun run api:generate`, `bun run build:web`).
- **FR-003**: O `apps/web/README.md` DEVE documentar a remoção dos elementos de teste (botão de código e alternador de perfil), a correção do layout de altura total do mapa (`h-screen min-h-0`), o agrupamento geoespacial via `use-supercluster`, e o PWA com Workbox.
- **FR-004**: O `apps/mobile/README.md` DEVE descrever o aplicativo nativo React Native com Expo SDK 51, React Navigation Bottom Tabs (Radar, Ganhos e Perfil com dados limpos), consumo do `@trampotaxa/shared` com Metro Bundler configurado e checagem de tipos sem erros.
- **FR-005**: O `packages/shared/README.md` DEVE documentar o pipeline Orval que lê `docs/openapi.yaml` e gera clientes e hooks do React Query v5, os validadores fiscais (CNPJ Módulo 11, telefone e moeda BRL) e os datasets estruturados.
- **FR-006**: O `apps/web/docs/README.md` DEVE indexar todos os artefatos de engenharia: `openapi.yaml`, `DATABASE_MER.md`, `EXPO_GO_GUIDE.md` e os relatórios de release.
- **FR-007**: Todos os arquivos README DEVEM eliminar qualquer instrução desatualizada baseada em `npm ci` sem lockfile ou caminhos herdados anteriores à reestruturação do monorepo.
- **FR-008**: Os fluxos de CI/CD do GitHub Actions (`deploy.yml` com Bun e `mobile-build.yml` com Node 24 + Bun) DEVEM estar devidamente referenciados e explicados.

### Key Entities

- **Monorepo Workspaces**: Estrutura modular contendo `apps/web` (SPA/PWA), `apps/mobile` (Expo/React Native) e `packages/shared` (Contratos, Tipos, Formatadores e API).
- **Contratos OpenAPI (CDD)**: Arquivo `docs/openapi.yaml` atuando como a fonte única da verdade para requisições, respostas, schemas e autenticação Bearer JWT.
- **Suíte de Testes TDD**: Conjunto de 91 testes automatizados cobrindo autenticação, gates de exceção de release, isolamento de mocks e lógica de domínio.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos arquivos README do monorepo sincronizados com a versão mais recente do código e dos fluxos CI/CD.
- **SC-002**: 0 referências a comandos quebrados de instalação ou caminhos inexistentes em toda a documentação.
- **SC-003**: Todas as 91 suítes de testes automatizados e a validação do linter continuam passando com código 0 após a revisão documental.
- **SC-004**: O desenvolvedor consegue rodar qualquer script listado nos READMEs em menos de 10 segundos utilizando Bun.

---

## Assumptions

- O repositório utiliza o Bun como gerenciador de pacotes e executor padrão de testes (`bun.lock` e `bun test`).
- O GitHub Pages é o ambiente de entrega contínua para a aplicação web, gerado a partir do workflow `.github/workflows/deploy.yml`.
- A autenticação mock e contratos foram arquitetados de acordo com a metodologia CDD e Spec-Kit para posterior acoplamento ao backend real.
