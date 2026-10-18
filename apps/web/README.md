# 🌐 TrampoTaxa Web — Aplicação SPA & PWA

Aplicação Web responsiva do ecossistema **TrampoTaxa (Loctaxa CWB)**, projetada para alta performance, suporte offline avançado (PWA), inteligência geoespacial com agrupamento de marcadores (Map Clustering) e interface de produção limpa.

---

## 🛠️ Stack Tecnológica

* **Framework UI:** [React 19](https://react.dev/) com TypeScript 5.8
* **Build Tool:** [Vite 8](https://vitejs.dev/) com Rolldown bundler
* **Gerenciamento de Estado de Servidor:** [TanStack React Query v5](https://tanstack.com/query) (`staleTime: 5min`, `retry: 1`)
* **Design System & Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) no tema escuro moderno (`#0A0B0E` e `#00E676`)
* **PWA & Offline Caching:** `vite-plugin-pwa` com estratégias de Workbox
* **Mapas & Performance Geoespacial:** `@vis.gl/react-google-maps`, `use-supercluster` e `supercluster`
* **Geração Automática de API:** [Orval 8](https://orval.dev/) consumindo OpenAPI 3.0 (`docs/openapi.yaml`)
* **Roteamento:** [React Router v7](https://reactrouter.com/) com RBAC (Controle de Acesso Baseado em Papéis)

---

## 🚀 Funcionalidades Principais & Arquitetura de Interface

### 1. Radar de Vagas & Layout Full-Bleed
- **Eliminação de Faixas em Branco:** Estrutura corrigida com Flexbox encadeado (`h-screen overflow-hidden` e `min-h-0`). A barra lateral de vagas possui rolagem interna estrita (`overflow-y-auto custom-scrollbar`), mantendo o mapa preenchendo 100% da viewport visível sem transbordamentos ou faixas vazias abaixo dele.
- **Agrupamento Dinâmico de Taxas (Clustering):** O `use-supercluster` agrupa marcadores de oportunidades em clusters (`ClusterMarker`) quando o zoom estiver afastado, exibindo a contagem de taxas naquela região com efeito de pulso neon verde (`#00E676`).
- **Expansão Fluida:** O cluster se expande automaticamente para marcadores individuais (`GigMarker`) exibindo o valor (`R$ 220,00`) ao clicar no grupo ou aproximar o zoom.
- **Resiliência e Fallback Vetorial:** Fallback vetorial em SVG (`MinimalVectorMap`) com suporte a arrasto (drag & pan) e zoom caso a chave externa do Google Maps não esteja configurada ou a rede oscile.

### 2. Interface Limpa de Produção (Zero-Noise UI)
- **Remoção de Botões de Desenvolvimento:** Os botões de atalho de depuração presentes em protótipos foram definitivamente removidos:
  - O botão e o modal de código-fonte (`CodeViewerModal`).
  - Os botões artificiais de alternância rápida de perfil (`Modo: Freelancer / Contratante` no cabeçalho, na tela de perfil e no mapa).
- O papel do usuário é derivado de forma estrita e segura da sua sessão autenticada.

### 3. Recursos Offline Avançados (PWA)
- **Service Worker Automático:** Gerado via `vite-plugin-pwa` com registro no entrypoint (`src/main.tsx`).
- **Estratégias de Cache Workbox:**
  - `NetworkFirst`: Rotas de API (`/api`, `/gigs`, `/earnings`, `/contractor`, `/chat`), mantendo os últimos dados disponíveis em zonas de sombra de conectividade celular.
  - `CacheFirst`: Assets estáticos (JavaScript, CSS, imagens SVG/PNG, fontes web).
- **Instalação Nativa:** Botão `PWAInstallButton` integrado, com guia interativo para iOS Safari e prompt direto para Chrome/Android.

### 4. Automação da API com OpenAPI + React Query
- Configurado via `orval.config.ts`, lendo o arquivo `docs/openapi.yaml`.
- Gera automaticamente clientes HTTP nativos (Fetch) e hooks do React Query (`useQuery` e `useMutation`).
- A saída é compartilhada em `packages/shared/src/api/` para que Web e Mobile consumam os mesmos contratos de dados.

---

## 📂 Estrutura de Diretórios

```
apps/web/
├── docs/                     # Documentação de banco de dados, relatórios e OpenAPI
│   ├── DATABASE_MER.md       # Diagrama de Entidade-Relacionamento e DBML
│   ├── EXPO_GO_GUIDE.md      # Guia de testes mobile
│   └── openapi.yaml          # Especificação OpenAPI 3.0 formal da API
├── public/
│   ├── icon.svg              # Ícone vetorial da marca
│   └── manifest.json         # Manifesto PWA com display standalone
├── src/
│   ├── components/           # Componentes modulares
│   │   ├── map/              # GigMarker, ClusterMarker, MapPlaceholder
│   │   ├── navigation/       # BottomNavigation para smartphones
│   │   └── ui/               # Botões, inputs mascarados e badges
│   ├── context/              # AuthContext e ContractorContext
│   ├── hooks/                # useGigsQuery, useEarningsQuery
│   ├── layouts/              # AppLayout com header limpo e proteções RBAC
│   ├── routes/               # Definição de rotas com React Router
│   ├── screens/              # Telas do Freelancer e Contratante
│   ├── main.tsx              # Ponto de entrada com registro do Service Worker
│   └── index.css             # Estilos globais Tailwind CSS v4
├── orval.config.ts           # Configuração de geração de hooks da API
├── vite.config.ts            # Configuração do Vite com VitePWA e Workbox
└── tsconfig.json             # Compilador TypeScript com suporte a PWA e GeoJSON
```

---

## 🛠️ Scripts Disponíveis (Bun)

```bash
# Iniciar servidor de desenvolvimento (porta 3000)
bun run dev:web

# Gerar código tipado da API a partir do openapi.yaml
bun run api:generate

# Validar lint e tipagem TypeScript (código 0, sem avisos)
bun run lint

# Executar testes unitários e de integração
bun test

# Gerar compilação de produção com Service Worker
bun run build:web
```
