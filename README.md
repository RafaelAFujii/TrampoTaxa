# 🍸 TrampoTaxa (Loctaxa) — Monorepo de Gestão de Taxas e Freelancers

[![CI/CD GitHub Pages](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml/badge.svg)](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml)
[![Mobile CI & EAS](https://github.com/akirarafael19/trampo-taxa/actions/workflows/mobile-build.yml/badge.svg)](https://github.com/akirarafael19/trampo-taxa/actions/workflows/mobile-build.yml)
[![Bun Monorepo](https://img.shields.io/badge/Bun-v1.4-black?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_51-000020?logo=expo)](https://expo.dev/)
[![Tests](https://img.shields.io/badge/Tests-91%20Passed-brightgreen?logo=vitest)](https://vitest.dev/)
[![Technical Debt](https://img.shields.io/badge/D%C3%A9bito_T%C3%A9cnico-0%25-brightgreen)](https://eslint.org/)

O **TrampoTaxa (Loctaxa CWB)** é um ecossistema digital em monorepo projetado para conectar **estabelecimentos gastronômicos** (restaurantes, bares, pubs e casas noturnas) a **profissionais autônomos e freelancers** (bartenders, garçons, cozinheiros e recepcionistas) para cobertura ágil de turnos temporários (*taxas*) em tempo real em Curitiba e região.

---

## 🌐 Links do Projeto

* 🚀 **Aplicação Web (GitHub Pages):** [https://akirarafael19.github.io/trampo-taxa/](https://akirarafael19.github.io/trampo-taxa/)
* 💻 **Repositório no GitHub:** [https://github.com/akirarafael19/trampo-taxa](https://github.com/akirarafael19/trampo-taxa)
* 🧪 **Ambiente de Desenvolvimento em Nuvem:** [Acessar Applet em Desenvolvimento](https://ais-dev-v6aa5zop4sov5raedzqgg4-97325856245.us-east1.run.app)

---

## 🏛️ Arquitetura do Monorepo (Bun Workspaces)

O repositório é gerenciado através do **Bun Workspaces**, garantindo separação rigorosa de responsabilidades, contratos compartilhados e execução ultrarrápida:

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

### Documentações Detalhadas por Módulo

* 🌐 **[Documentação do Front-End Web (`apps/web/README.md`)](./apps/web/README.md):** SPA React 19, Tailwind CSS v4, PWA com Workbox offline caching, Map Clustering geoespacial (`use-supercluster`), layout full-bleed e remoção de botões de teste.
* 📱 **[Documentação do Aplicativo Móvel (`apps/mobile/README.md`)](./apps/mobile/README.md):** React Native nativo com Expo SDK 51, React Navigation Bottom Tabs (Radar, Ganhos e Perfil), Metro Bundler integrado ao shared e checagem de tipos estrita.
* ⚙️ **[Documentação do Backend & API Core (`packages/shared/README.md`)](./packages/shared/README.md):** Especificação OpenAPI 3.0 (`docs/openapi.yaml`), pipeline Orval de geração de código tipado, validação de CNPJ Módulo 11 e datasets de domínio.
* 📚 **[Índice de Documentos de Arquitetura (`apps/web/docs/README.md`)](./apps/web/docs/README.md):** Modelagem MER/DER de banco de dados, dicionário DBML, guia do Expo Go e relatórios de conformidade.

---

## ✨ Inovações e Recursos Chave do Sistema

1. **Automação de Contratos (OpenAPI 3.0 + Orval + React Query v5):**
   - O contrato formal em `apps/web/docs/openapi.yaml` é a fonte absoluta da verdade para clientes HTTP e hooks tipados em `packages/shared/src/api/`.
   - Execução automatizada com o comando: `bun run api:generate`.

2. **Interface Limpa de Produção (Zero-Noise UI):**
   - Eliminação completa de controles artificiais de desenvolvimento: botão de código-fonte (`CodeViewerModal`) e alternadores manuais de perfil (`switchRole`), garantindo fidelidade estrita à sessão autenticada do usuário.

3. **Layout de Tela Cheia e Resiliência Geoespacial:**
   - Correção estrutural do layout de mapa (`h-screen overflow-hidden` e `min-h-0`), permitindo que a barra lateral de vagas tenha rolagem interna independente sem expandir o corpo da página nem deixar faixas em branco no rodapé do mapa.
   - Agrupamento inteligente de marcadores com `use-supercluster` e fallback vetorial interativo com arrasto e zoom.

4. **Capacidades Offline Avançadas (PWA):**
   - Service Worker gerado automaticamente com Workbox: estratégia `NetworkFirst` para endpoints de vagas e relatórios financeiros (tolerância a zonas de sombra celular) e `CacheFirst` para assets estáticos.

5. **Aplicativo Móvel 100% Nativo:**
   - Navegação por abas nativas com `@react-navigation/bottom-tabs` e `@react-navigation/native`.
   - Listas performáticas com `FlatList` e `RefreshControl` nativo (pull-to-refresh).

---

## 🛠️ Guia Rápido de Comandos (Bun)

Todos os comandos são executados a partir da raiz do monorepo:

```bash
# 1. Instalar todas as dependências do monorepo
bun install

# 2. Iniciar a aplicação Web em desenvolvimento (localhost:3000)
bun run dev:web

# 3. Iniciar o servidor Metro Bundler do aplicativo móvel
bun run dev:mobile

# 4. Executar toda a suíte de 91 testes automatizados (TDD)
bun test

# 5. Executar a análise estática e linter (código 0, sem warnings)
bun run lint

# 6. Executar a verificação de tipos TypeScript no mobile
bun run typecheck:mobile

# 7. Gerar clientes HTTP e hooks React Query a partir do openapi.yaml
bun run api:generate

# 8. Compilar os assets de produção da Web com Service Worker
bun run build:web
```

---

## 🔄 Pipelines de Integração e Entrega Contínua (CI/CD)

* **`.github/workflows/deploy.yml`**: Configurado com a ação oficial `oven-sh/setup-bun@v2`, instala dependências (`bun install`), roda a suíte de testes (`bun test`), valida o linter (`bun run lint`), compila o bundle de produção (`bun run build`) e publica no GitHub Pages.
* **`.github/workflows/mobile-build.yml`**: Configurado com Node.js 24 (`actions/setup-node@v4`) e Bun (`oven-sh/setup-bun@v2`), valida a estrutura do aplicativo Expo com `expo/expo-github-action@v8` (`packager: bun`) e realiza a simulação do EAS Build (`bunx expo config --type public`).

---

## 🧪 Governança, TDD e Portas de Qualidade

A suíte de **91 testes automatizados** valida:
- **Regras Fiscais:** Algoritmo matemático Módulo 11 de CNPJs, sanitização e máscaras de moeda BRL (`formatCurrency`).
- **Segurança & RBAC:** Validação de payloads cadastrais, isolamento de mocks em produção e verificação de Bearer tokens para rotas privadas.
- **Portas de Exceção de Release:** Mecanismo fail-closed que bloqueia builds com riscos críticos não autorizados.
- **Domínio de Vagas:** Filtros por profissão, geolocalização e ordenação por remuneração horária.
