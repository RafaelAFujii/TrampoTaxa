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
* **Rolagem Vertical Fluida:** Todas as telas de gestão contam com rolagem suave (`overflow-y-auto`), permitindo a visualização de listas extensas de candidatos e turnos sem bloqueios.

---

## 📱 Recursos de PWA e Offline Caching

* **Service Worker com Workbox:**
  * `NetworkFirst`: Aplicado a todas as rotas de dados (`/api`, `/gigs`, `/earnings`, `/contractor`, `/chat`), permitindo consultar vagas e relatórios mesmo em áreas de sinal instável em Curitiba.
  * `CacheFirst`: Para folhas de estilo, fontes e scripts estáticos.
* **Interface Limpa:** A aplicação não exibe botões artificiais de código ou alternadores de papel manuais, assegurando a autenticidade da experiência em produção.

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
