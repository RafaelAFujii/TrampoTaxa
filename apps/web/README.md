# 🌐 TrampoTaxa Web — Aplicação SPA & PWA

Aplicação Web responsiva do ecossistema **TrampoTaxa (Loctaxa CWB)**, focada em alta performance, mapas geoespaciais com clustering, suporte offline avançado (PWA) e interface limpa de produção.

---

## 🛠️ Stack Tecnológica Web

* **Framework UI:** [React 19](https://react.dev/) com TypeScript 5.8
* **Build Tool:** [Vite 8](https://vitejs.dev/) com suporte a HMR condicional
* **Estado de Servidor:** [TanStack React Query v5](https://tanstack.com/query) (`staleTime: 5min`, `retry: 1`)
* **Design & Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com paleta escura (`#0A0B0E`, `#121418`) e acento verde neon (`#00E676`)
* **Inteligência Geoespacial:** `@vis.gl/react-google-maps`, `use-supercluster` e mapa vetorial em SVG nativo
* **Offline & PWA:** `vite-plugin-pwa` e Workbox (`NetworkFirst` e `CacheFirst`)
* **Roteamento & Proteção:** [React Router v7](https://reactrouter.com/) com segregação de rotas por papel de usuário (RBAC)

---

## 📁 Estrutura de Diretórios e Submódulos

```
apps/web/
├── public/                     # Ícones, manifesto PWA e assets estáticos
├── src/
│   ├── components/             # Componentes modulares de UI, mapas e modais
│   │   ├── chat/               # Modal de chat com o contratante
│   │   ├── flow/               # Modais de fluxo de turno (QR Scanner, Avaliação)
│   │   ├── map/                # Marcadores, Radar e visualização vetorial de fallback
│   │   ├── navigation/         # Barra de navegação inferior responsiva
│   │   ├── ui/                 # Elementos atômicos (Botões, Toggles, Inputs)
│   │   └── README.md           # Documentação detalhada dos componentes
│   │
│   ├── context/                # Contextos de autenticação, contratante e freelancer
│   │   ├── AuthContext.tsx     # Sessão JWT e RBAC
│   │   ├── ContractorContext.tsx # Estado de vagas e candidatos do contratante
│   │   ├── FreelancerFlowContext.tsx # Máquina de estados do turno do freelancer
│   │   └── README.md           # Documentação detalhada dos contextos
│   │
│   ├── hooks/                  # Hooks customizados para regras de negócio
│   │   ├── useFreelancerGigFlow.ts # Orquestração do turno do profissional
│   │   ├── useGigsQuery.ts     # Query cacheada de vagas disponíveis
│   │   └── README.md           # Documentação detalhada dos hooks
│   │
│   ├── layouts/                # Moldura da aplicação (AppLayout)
│   │
│   ├── routes/                 # Roteamento declarativo e guardas
│   │   ├── ProtectedRoute.tsx  # Guarda de rotas com verificação de perfil
│   │   ├── routes.tsx          # Definição das rotas da aplicação
│   │   └── README.md           # Documentação detalhada das rotas
│   │
│   ├── screens/                # Telas completas da aplicação
│   │   ├── contractor/         # Telas dedicadas ao estabelecimento
│   │   ├── ActiveGigScreen.tsx # Visão do turno ativo com check-in
│   │   ├── CadastroScreen.tsx  # Cadastro com seleção de perfil
│   │   ├── EarningsScreen.tsx  # Extrato financeiro com repasse PIX
│   │   ├── LoginScreen.tsx     # Autenticação com credenciais
│   │   ├── MapDashboardScreen.tsx # Radar de vagas em tempo real
│   │   ├── ProfileScreen.tsx   # Perfil e configurações do usuário
│   │   └── README.md           # Documentação detalhada de cada tela
│   │
│   ├── App.tsx                 # Composição dos Provedores e Rotas
│   ├── main.tsx                # Bootstrap da aplicação React
│   └── index.css               # Import do Tailwind CSS e estilos globais
│
├── vite.config.ts              # Configuração Vite com Workbox PWA
└── tsconfig.json               # Configuração TypeScript Web
```

---

## 🎯 Experiências de Uso no Front-End Web

### 1. Visão do Freelancer (Profissional Autônomo)
* **Radar em Tela Cheia (Full-Bleed):** O mapa ocupa 100% da viewport (`h-screen overflow-hidden`), sem faixas em branco no rodapé. A barra lateral esquerda possui rolagem interna independente (`overflow-y-auto custom-scrollbar`).
* **Clustering de Oportunidades:** Grupos de vagas são condensados visualmente pelo `use-supercluster`, exibindo a quantidade de taxas com pulso verde neon. Ao aproximar o zoom ou clicar, o cluster se divide em marcadores individuais (`GigMarker`) com o valor do turno (ex: `R$ 220,00`).
* **Resiliência Vetorial (`MinimalVectorMap`):** Se a conexão cair ou a chave da API do Google não estiver configurada, o sistema aciona um mapa vetorial interativo em SVG com suporte completo a arrasto (drag/pan), zoom e clique.
* **Detalhes do Turno & Traje:** Ao clicar em uma vaga, um Bottom Sheet é aberto com o briefing de apresentação (ex: camisa preta lisa, avental e abridor de garrafas), valor e botão de candidatura imediata.
* **Extrato de Ganhos (`/earnings`):** Visão diária, semanal e mensal de rendimentos com lista detalhada de turnos e status de repasse PIX.

### 2. Visão do Contratante (Estabelecimento Gastronômico)
* **Gestão de Vagas (`/contractor/gigs`):** Painel com abas segmentadas por status (*Todas*, *Abertas*, *Aguardando Confirmação*, *Preenchidas*, *Finalizadas*).
* **Criação Rápida de Taxas (`/contractor/create`):** Formulário completo com validação de remuneração horária, horário de início/término, função e dress code.
* **Triagem de Candidatos:** Visualização de candidatos com foto, estrelas de avaliação, pontualidade e turnos concluídos, com botões de aprovação e recusa em tempo real.
* **Chat Operacional (`/contractor/chat`):** Mensageria instantânea com freelancers aprovados para alinhamento de portaria e chegada.
* **Tela de Estabelecimento (`/profile`):** Informações cadastrais completas da empresa (Razão Social, CNPJ mascarado, segmento, total de vagas e investimento financeiro).

---

## 📱 Recursos de PWA e Offline Caching

* **Service Worker com Workbox:**
  * `NetworkFirst`: Aplicado a rotas de dados dinâmicos (`/api`, `/gigs`, `/earnings`, `/contractor`, `/chat`), permitindo consultar vagas e relatórios mesmo em áreas de sinal instável em Curitiba.
  * `CacheFirst`: Para folhas de estilo, fontes e scripts estáticos.

---

## 🛠️ Comandos de Execução (Bun)

A partir da raiz do monorepo:

```bash
# Iniciar ambiente web de desenvolvimento (porta 3000)
bun run dev:web

# Executar a análise estática (ESLint 0 erros)
bun run lint

# Executar suíte de testes unitários e de rotas
bun test

# Compilar para produção (gera pasta apps/web/dist)
bun run build:web
```

---

## 🔗 Navegação Modular

* Componentes reutilizáveis: [src/components/README.md](./src/components/README.md)
* Contextos e estado global: [src/context/README.md](./src/context/README.md)
* Hooks customizados: [src/hooks/README.md](./src/hooks/README.md)
* Rotas e proteção RBAC: [src/routes/README.md](./src/routes/README.md)
* Telas da aplicação: [src/screens/README.md](./src/screens/README.md)
