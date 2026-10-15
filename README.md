# 🍸 TrampoTaxa (Loctaxa) — Monorepo de Gestão de Taxas e Freelancers

[![CI/CD GitHub Pages](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml/badge.svg)](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml)
[![Mobile CI & EAS](https://github.com/akirarafael19/trampo-taxa/actions/workflows/mobile-build.yml/badge.svg)](https://github.com/akirarafael19/trampo-taxa/actions/workflows/mobile-build.yml)
[![Bun Monorepo](https://img.shields.io/badge/Bun-v1.4-black?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?logo=expo)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-22%20Passed-brightgreen?logo=vitest)](https://vitest.dev/)

O **TrampoTaxa (Loctaxa CWB)** é um ecossistema digital em monorepo projetado para conectar **estabelecimentos gastronômicos** (restaurantes, bares, pubs e casas de eventos) a **profissionais autônomos e freelancers** (bartenders, garçons, cozinheiros e recepcionistas) para cobertura de turnos temporários (*taxas*) em tempo real.

---

## 🌐 Links do Projeto

* 🚀 **Aplicação Web (GitHub Pages):** [https://akirarafael19.github.io/trampo-taxa/](https://akirarafael19.github.io/trampo-taxa/)
* 💻 **Repositório GitHub:** [https://github.com/akirarafael19/trampo-taxa](https://github.com/akirarafael19/trampo-taxa)
* 🧪 **Ambiente de Desenvolvimento em Nuvem:** [Acessar Applet em Desenvolvimento](https://ais-dev-v6aa5zop4sov5raedzqgg4-97325856245.us-east1.run.app)

---

## 🏛️ Arquitetura do Monorepo (Bun Workspaces)

O repositório é gerenciado através do **Bun Workspaces**, dividindo responsabilidades de forma modular:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TRAMPOTAXA MONOREPO ROOT                        │
│   "workspaces": ["apps/*", "packages/*"]                               │
└──────────────┬────────────────────────────┬────────────────────────────┘
               │                            │
       ┌───────▼─────────┐          ┌───────▼─────────┐
       │    apps/web     │          │   apps/mobile   │
       │ (React 19 + PWA)│          │ (Expo + Native) │
       └───────┬─────────┘          └───────┬─────────┘
               │                            │
               │   import from              │   import from
               │   "@trampotaxa/shared"     │   "@trampotaxa/shared"
               ▼                            ▼
      ┌──────────────────────────────────────────────────┐
      │                 packages/shared                  │
      │  • api/    (Hooks React Query gerados via Orval) │
      │  • types/  (GigOffer, User, ContractorGig...)    │
      │  • utils/  (formatCurrency, formatCNPJ...)       │
      │  • data/   (mockGigs, mockContractorData...)     │
      └──────────────────────────────────────────────────┘
```

### Documentações Específicas por Workspace

* 🌐 **[Documentação do Front-End Web (`apps/web/README.md`)](./apps/web/README.md):** PWA, Workbox offline caching, Map Clustering (`use-supercluster`), React 19 e Tailwind CSS v4.
* 📱 **[Documentação do Aplicativo Móvel (`apps/mobile/README.md`)](./apps/mobile/README.md):** React Native nativo, Expo SDK 51, React Navigation Bottom Tabs, `react-native-maps`, Metro Bundler e geração de APK.
* ⚙️ **[Documentação do Backend & API Core (`packages/shared/README.md`)](./packages/shared/README.md):** Contratos OpenAPI 3.0 (`docs/openapi.yaml`), pipeline de geração de código com Orval, modelagem de banco de dados MER e validadores fiscais.

---

## ✨ Inovações e Recursos de Destaque

1. **Automação da API (OpenAPI 3.0 + Orval + React Query):**
   - O contrato formal em `apps/web/docs/openapi.yaml` gera automaticamente os clientes HTTP e custom hooks do React Query v5 em `packages/shared/src/api/`.
   - Executado via `bun run api:generate`.

2. **Capacidades Offline Avançadas (PWA):**
   - Service Worker com geração automática via `vite-plugin-pwa` e `workbox-window`.
   - Estratégia `NetworkFirst` para chamadas de API (rotas de vagas e relatórios) com tolerância a zonas de sombra de conectividade, e `CacheFirst` para assets estáticos.

3. **Performance Geoespacial (Map Clustering):**
   - Agrupamento inteligente de taxas por proximidade via `use-supercluster`.
   - Marcadores de cluster neon (`ClusterMarker`) exibindo a contagem de taxas na região, expandindo para marcadores individuais (`GigMarker`) com valor em BRL ao aproximar o zoom.

4. **Aplicativo Móvel 100% Nativo:**
   - Navegação inferior nativa (`@react-navigation/bottom-tabs`) com abas para **Radar**, **Ganhos** e **Perfil**.
   - Lista otimizada via `FlatList` com `RefreshControl` e alternador de perfil (Freelancer / Contratante).

---

## 🛠️ Guia Rápido de Comandos

Todos os comandos podem ser executados diretamente a partir da raiz do monorepo utilizando o **Bun**:

```bash
# 1. Instalar todas as dependências do monorepo
bun install

# 2. Iniciar a aplicação Web em desenvolvimento (localhost:3000)
bun run dev:web

# 3. Iniciar o aplicativo móvel no Expo Metro Bundler
bun run dev:mobile

# 4. Executar os 22 testes unitários e de domínio (TDD)
bun test

# 5. Executar a validação de código (Linter)
bun run lint

# 6. Executar a checagem de tipos do aplicativo móvel
bun run typecheck:mobile

# 7. Gerar clientes e hooks a partir do openapi.yaml
bun run api:generate

# 8. Compilar a versão de produção da Web
bun run build:web
```

---

## 🔄 Pipelines de CI/CD (GitHub Actions)

* **`.github/workflows/deploy.yml`**: Roda testes automatizados (`bun test`), validação com linter (`bun run lint`) e gera o build de produção com deploy no GitHub Pages.
* **`.github/workflows/mobile-build.yml`**: Roda em Node 24 e Bun, validando a estrutura do aplicativo Expo e preparando simulações para o EAS Build.
