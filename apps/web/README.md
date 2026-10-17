# 🌐 TrampoTaxa Web — Aplicação SPA & PWA

Aplicação Web responsiva do ecossistema **TrampoTaxa (Loctaxa CWB)**, projetada para alta performance, suporte offline avançado (PWA) e inteligência geoespacial com agrupamento de marcadores (Map Clustering).

---

## 🛠️ Stack Tecnológica

* **Framework UI:** [React 19](https://react.dev/) com TypeScript 5.8
* **Build Tool:** [Vite 8](https://vitejs.dev/) com Rolldown bundler
* **Gerenciamento de Estado de Servidor:** [TanStack React Query v5](https://tanstack.com/query) (`staleTime: 5min`, `retry: 1`)
* **Design System & Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) no tema escuro moderno (`#0A0B0E` e `#00E676`)
* **PWA & Offline Caching:** `vite-plugin-pwa` com estratégias de Workbox
* **Mapas & Performance Geoespacial:** `@vis.gl/react-google-maps`, `use-supercluster` e `supercluster`
* **Geração Automática de API:** [Orval 8](https://orval.dev/) consumindo o contrato OpenAPI 3.0 mantido por `packages/shared`
* **Roteamento:** [React Router v7](https://reactrouter.com/) com RBAC (Controle de Acesso Baseado em Papéis)

Fixtures de demonstração são importadas por `@trampotaxa/shared/mocks` somente em fallbacks de desenvolvimento ou testes. O ponto de entrada padrão `@trampotaxa/shared` não exporta datasets mockados e a compilação de produção não os inclui.

---

## 🚀 Funcionalidades Principais

### 1. Radar de Vagas & Map Clustering
- **Agrupamento Dinâmico de Taxas:** Utilização do `use-supercluster` para agrupar marcadores em clusters (`ClusterMarker`) quando o zoom estiver afastado, exibindo a quantidade de taxas naquela região com efeito de pulso neon verde (`#00E676`).
- **Expansão Fluida:** O cluster se expande automaticamente para os marcadores individuais (`GigMarker`) exibindo o valor (`R$ 220,00`) ao clicar no grupo ou aproximar o zoom.
- **Controles Interativos:** Botões flutuantes para recentralizar em Curitiba (Batel/Centro) e controles de zoom (`+` e `-`).
- **Resiliência Offline (Vector Fallback):** Fallback vetorial em SVG caso a chave de API do mapa não esteja configurada ou a rede oscile.

### 2. Recursos Offline Avançados (PWA)
- **Service Worker Automático:** Gerado via `vite-plugin-pwa` com registro no entrypoint (`src/main.tsx`).
- **Estratégias de Cache Workbox:**
  - `NetworkFirst`: Rotas de API (`/api`, `/gigs`, `/earnings`, `/contractor`, `/chat`), mantendo os últimos dados disponíveis em zonas de sombra de conectividade.
  - `CacheFirst`: Assets estáticos (JavaScript, CSS, imagens SVG/PNG, fontes web).
- **Instalação Nativa:** Botão `PWAInstallButton` integrado, com guia interativo para iOS Safari e prompt direto para Chrome/Android.

### 3. Automação da API com OpenAPI + React Query
- O contrato e a configuração Orval pertencem a `packages/shared/openapi.yaml` e `packages/shared/orval.config.ts`.
- Gera automaticamente clientes HTTP nativos (Fetch) e hooks do React Query (`useQuery` e `useMutation`).
- A saída é compartilhada em `packages/shared/src/api/` para que Web e Mobile consumam os mesmos contratos de dados.

### 4. Módulos Operacionais
- **Visão Freelancer:** Radar geolocalizado, consulta de vagas em lista/mapa, bottom sheet com microtreinamento, turno ativo com rota GPS, extrato financeiro com repasse PIX e perfil.
- **Visão Contratante:** Publicação de turnos com dress code e regras, triagem de candidatos em tempo real (aprovação/rejeição), chat operacional e relatórios financeiros/KPIs.

---

## 📂 Estrutura de Diretórios

```
apps/web/
├── docs/                     # Documentação de banco de dados e relatórios
│   ├── DATABASE_MER.md       # Diagrama de Entidade-Relacionamento e DBML
│   ├── EXPO_GO_GUIDE.md      # Guia de testes mobile
├── public/
│   ├── icon.svg              # Ícone vetorial da marca
│   └── manifest.json         # Manifesto PWA com display standalone
├── src/
│   ├── components/           # Componentes modulares
│   │   ├── map/              # GigMarker, ClusterMarker, MapPlaceholder
│   │   ├── navigation/       # BottomNavigation para smartphones
│   │   └── ui/               # Botões, inputs mascarados e toggles
│   ├── context/              # AuthContext e ContractorContext
│   ├── hooks/                # useGigsQuery, useEarningsQuery
│   ├── layouts/              # AppLayout com header e proteções
│   ├── routes/               # Definição de rotas com React Router
│   ├── screens/              # Telas do Freelancer e Contratante
│   ├── main.tsx              # Ponto de entrada com registro do Service Worker
│   └── index.css             # Estilos globais Tailwind CSS v4
├── vite.config.ts            # Configuração do Vite com VitePWA e Workbox
└── tsconfig.json             # Compilador TypeScript com suporte a PWA e GeoJSON
```

---

## 🛠️ Scripts Disponíveis

Executados a partir da raiz do monorepo ou dentro de `apps/web`:

```bash
# Iniciar servidor de desenvolvimento (porta 3000)
bun run dev:web
# ou
npm --prefix apps/web run dev

# Gerar código tipado da API a partir do openapi.yaml
bun run api:generate
# ou
npm --prefix packages/shared run api:generate

# Validar lint e tipagem TypeScript
bun run lint
# ou
npm --prefix apps/web run lint

# Executar testes unitários e de integração
bun test
# ou
npm --prefix apps/web test

# Gerar compilação de produção com Service Worker
bun run build:web
# ou
npm --prefix apps/web run build
```
