<!--
Sync Impact Report
Version change: 1.0.0 → 2.0.0
Modified principles:
  - Adição de tRPC v11 como Fonte Única de Comunicação (Proibição absoluta de clientes REST/Orval)
  - Isolamento estrito de regras de negócio em packages/shared e padronização de Telas Burras (Dumb UI)
  - Política de Estado Global de Alta Performance (React Query via tRPC + Zustand; Proibição de Context API para estados mutáveis complexos)
  - Obrigatoriedade de watchFolders no Metro Bundler (apps/mobile/metro.config.js) para Bun Workspaces
  - Princípio Anti-Bloat: Higiene do repositório, concisão gerativa e bloqueio de artefatos de IA no .gitignore
-->

# TrampoTaxa Constitution (SDD & Monorepo Architecture)

## Core Principles (Regras Inquebráveis de Engenharia)

### I. tRPC como Fonte Única de Comunicação (Zero REST / Zero Orval)
Toda a comunicação cliente-servidor entre o backend (`apps/server`) e as aplicações clientes (`apps/web` e `apps/mobile`) DEVE utilizar estrita e exclusivamente o **tRPC v11**.
- **PROIBIÇÃO ABSOLUTA**: É expressamente proibido gerar, sugerir, manter ou utilizar clientes REST (Orval, OpenAPI generator, axios manual ou fetch desacoplado de contratos) em `packages/shared/src/api` ou nos apps.
- **CONTRATO ÚNICO**: A tipagem de `AppRouter` do `apps/server` é o único contrato de rede do monorepo, consumido ponta a ponta com total type-safety em tempo de compilação.

### II. Maximização do `packages/shared` e Telas Burras (Dumb UI)
O pacote `@trampotaxa/shared` DEVE ser o núcleo isolado de toda a inteligência do monorepo.
- **ISOLAMENTO DE NEGÓCIO**: Toda lógica de negócios, chamadas e mutations tRPC, validações de domínio, cálculos fiscais, formatadores e custom hooks (ex: `useFreelancerGigFlow`, hooks de turno e cálculo de distâncias) DEVEM residir única e exclusivamente em `packages/shared`.
- **DUMB UI**: As pastas `apps/mobile/src/screens/` e `apps/web/src/screens/` DEVEM conter APENAS componentes de renderização visual e tratamento de eventos de tela. É PROIBIDO manter regras de negócio, manipulação complexa de estado de rede ou processamento de domínio dentro dos arquivos de tela. Telas devem apenas plugar os hooks exportados por `packages/shared`.

### III. Estado Global de Alta Performance (Zustand + React Query)
O gerenciamento de estado da aplicação deve seguir rigorosos critérios de performance e descarte de re-renderizações desnecessárias:
- **PROIBIÇÃO DE CONTEXT API PARA ESTADOS MUTÁVEIS COMPLEXOS**: É terminantemente proibido utilizar a Context API nativa do React para gerenciar fluxos de dados mutáveis, de alta frequência ou assíncronos (ex: ciclo de vida de Gigs, escaneamento de QR Code de check-in/out, relatórios financeiros ou chats).
- **ESTADO ASSÍNCRONO / REDE**: Deve ser delegado integralmente ao **TanStack React Query v5** orquestrado através do cliente tRPC.
- **ESTADO SÍNCRONO / LOCAL COMPLEXO**: Deve ser gerenciado via **Zustand** com stores isoladas e selectors atômicos no `packages/shared`.
- **USO DO REACT CONTEXT**: Permitido unicamente para injeção estática de dependências imutáveis ou configuração de nível de árvore (ex: troca estática de tema).

### IV. Metro Bundler com Resolução Explícita de Workspaces
Para viabilizar a execução nativa do React Native no monorepo Bun:
- O arquivo `apps/mobile/metro.config.js` DEVE conter obrigatoriamente a configuração explícita de `watchFolders = [monorepoRoot]` e o mapeamento de `nodeModulesPaths` e `extraNodeModules` apontando para `packages/shared`.
- Nenhuma alteração pode remover ou ignorar essa configuração sob pena de quebra de symlinks no runtime do Expo.

### V. Anti-Bloat e Higiene Estrita do Repositório
O framework Spec-Kit e os agentes de IA DEVEM priorizar concisão técnica e limpeza cirúrgica:
- **BLOQUEIO DE LIXO GERATIVO**: O `.gitignore` DEVE conter bloqueios explícitos para diretórios temporários e de artefatos de IA (ex: `.aistudio/`, `.aistudio/artifacts/`, `*.tmp`).
- **CONCISÃO DE CÓDIGO**: Evitar arquivos de documentação redundantes ou repetitivos que poluem o monorepo. Cada arquivo gerado deve ter propósito funcional imediato e valor arquitetural comprovado.

### VI. TypeScript Estrito e Test-First (TDD)
- Todo o código funcional DEVE ser escrito em TypeScript estrito (`strict: true`), sem uso de `any` injustificado.
- Mudanças comportamentais DEVEM ser acompanhadas por testes Vitest/Bun Test, respeitando o ciclo red-green-refactor.
- Débito técnico em ferramentas de qualidade (ESLint) DEVE permanecer strictly abaixo de 10% (visando 0% de avisos e erros).

---

## Architecture and Security Constraints

1. **Stack Oficial**:
   - Backend: `apps/server` (Fastify + tRPC v11 + Drizzle ORM).
   - Web: `apps/web` (React 19 + Vite + Tailwind CSS v4).
   - Mobile: `apps/mobile` (React Native 0.74 + Expo SDK 51 + React Navigation).
   - Shared: `packages/shared` (TypeScript + tRPC Client Hooks + Zustand Stores).
2. **Segurança Fail-Closed**:
   - Autenticação e autorização RBAC DEVEM ser validadas no middleware do tRPC (`init.ts`), rejeitando no nível de servidor qualquer operação com token ausente ou papel incompatível.
   - O cliente não pode assumir autorização baseando-se apenas na visibilidade de componentes gráficos.

---

## Governance

Esta Constituição define as regras de engenharia imutáveis do projeto TrampoTaxa. Qualquer proposta de especificação, plano ou implementação gerada via Spec-Kit que viole estes princípios deve ser imediatamente rejeitada pelos gates de validação.

**Version**: 2.0.0 | **Ratified**: 2026-11-08 | **Last Amended**: 2026-11-08
