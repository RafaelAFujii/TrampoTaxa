# Conexão do Aplicativo Móvel (Expo/React Native) ao Pacote Compartilhado e React Query

Integração arquitetural completa do aplicativo móvel (`apps/mobile`), conectando-o diretamente à lógica compartilhada do `@trampotaxa/shared` (tipagens unificadas, utilitários fiscais e hooks/queries do TanStack React Query), com navegação inferior nativa (`@react-navigation/bottom-tabs`), mapa nativo com fallback e visual escuro com detalhes em verde neon (`#00E676`).

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas pelo usuário na Fase 1:**
> 1. **Arquitetura de Navegação:** Utilização do `React Navigation Bottom Tabs` (`@react-navigation/bottom-tabs` e `@react-navigation/native`) para oferecer transições fluidas e gestos nativos entre as abas principais (Mapa, Relatórios e Perfil).
> 2. **Perspectiva do Usuário no Perfil:** Foco principal na visão do Freelancer (avaliação, pontualidade, ganhos e chave PIX cadastrada), acompanhado de um alternador ágil de perfil para o modo Contratante/Estabelecimento, permitindo validação ponta a ponta de ambos os papéis operacionais.
> 3. **Resiliência do Mapa no Expo:** Implementação do `react-native-maps` com suporte a `MapView` nativo e detecção com fallback gracioso de cartões de geolocalização e lista de oportunidades, garantindo funcionamento ininterrupto em qualquer simulador, emulador ou Expo Go sem exigir chaves de API restritas de terceiros no teste local.

---

## 1. Overview & Core Concept

- **O que faz:**
  1. Converte o app mobile de um encapsulador webview para uma aplicação nativa modular desenvolvida em React Native e Expo 51.
  2. Inicializa o `QueryClient` no `apps/mobile/App.tsx` com as mesmas diretrizes da aplicação web (`staleTime: 5 * 60 * 1000` e `retry: 1`), provendo o `QueryClientProvider` para toda a árvore de componentes.
  3. Implementa a tela `MapScreen.tsx` consumindo oportunidades de trabalho (`GigOffer[]`) diretamente de `@trampotaxa/shared`, com marcadores geolocalizados, indicador nativo de carregamento (`ActivityIndicator`), tratamento de erros e fallback de lista/cartões.
  4. Implementa a tela `EarningsScreen.tsx` renderizando o balanço e histórico de turnos via `FlatList` nativo, formatando moedas com `formatCurrency(amount)` de `@trampotaxa/shared`.
  5. Implementa a tela `ProfileScreen.tsx` com dados cadastrais, indicadores de pontualidade, dados bancários/PIX e toggle de visualização (Freelancer x Contratante).
  6. Configura a navegação inferior com ícones temáticos e paleta escura (`#0A0B0E`, superfícies `#141722`, texto `#FFFFFF` e destaques `#00E676`).
  7. Ajusta a resolução de módulos do Metro Bundler (`metro.config.js`) e TypeScript (`tsconfig.json`) para que o Expo resolva `@trampotaxa/shared` sem fricção no monorepo Bun.

- **Público-Alvo:** Profissionais autônomos (freelancers de bares e restaurantes) e gerentes de estabelecimentos gastronômicos em Curitiba que operam via smartphone com conectividade móvel.

---

## 2. User Experience & Visual Design

- **Direção Estética & Tema:**
  - **Fundo Principal (60%):** Fundo escuro absoluto `#0A0B0E` com compensação ótica para telas OLED.
  - **Superfícies & Cartões (30%):** Superfícies `#141722` e `#191D2B` com bordas sutis `rgba(255, 255, 255, 0.08)`.
  - **Acentos & Ação (10%):** Verde neon TrampoTaxa `#00E676` (e estados de alerta em `#FF5252`).
  - **Tipografia & Legibilidade:** Tipos nativos do sistema (San Francisco / Roboto), com números tabulares para valores monetários e horários de turno.

- **Fluxo do Usuário nas 3 Abas:**
  - **Aba 1 - Mapa (`MapScreen`):** Visualização do radar de Curitiba com marcadores de taxas, cartões rápidos com valor (`R$ 220,00`), botão de busca e filtro por profissão (Bartender / Garçom).
  - **Aba 2 - Relatórios (`EarningsScreen`):** Cards de faturamento no topo (Hoje, Semana, Mês) e lista em `FlatList` com status de pagamento PIX e pull-to-refresh acionando o React Query.
  - **Aba 3 - Perfil (`ProfileScreen`):** Foto do usuário, badge de avaliação (ex: `4.9 ★`), taxa de pontualidade (`99%`), especialidades e chave PIX cadastrada, com botão para alternar entre perfil de Freelancer e Contratante.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisão 1: React Navigation Bottom Tabs com Abas Nativas**
  - *Abordagem Escolhida:* Utilização de `@react-navigation/native` e `@react-navigation/bottom-tabs`.
  - *Por que:* É o padrão da indústria no ecossistema React Native, provê integração correta com safe areas (entalhes e barras inferiores de iPhone/Android) e excelente desempenho de troca de telas sem remontagens destrutivas.

- **Decisão 2: Consumo Unificado do `@trampotaxa/shared`**
  - *Abordagem Escolhida:* O aplicativo móvel importa diretamente tipos (`GigOffer`, `User`, `ContractorGig`), mocks e funções utilitárias (`formatCurrency`, `formatCNPJ`, `formatPhone`), além dos endpoints gerados do Orval.
  - *Por que:* Elimina qualquer divergência de schema entre plataformas e valida a proposta de valor central do monorepo.

- **Decisão 3: Configuração do Metro Bundler para o Monorepo Bun**
  - *Abordagem Escolhida:* Criação de `apps/mobile/metro.config.js` com `watchFolders: [monorepoRoot]` e `nodeModulesPaths` adicionando o `node_modules` da raiz.
  - *Por que:* O Metro Bundler no Expo por padrão não busca pacotes fora do diretório do projeto; com essa configuração, ele resolve workspaces locais instantaneamente.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Componentes e Fluxo de Dados Mobile

```
┌────────────────────────────────────────────────────────────────────────┐
│                          apps/mobile/App.tsx                           │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │            QueryClientProvider (TanStack v5)               │     │
│     │        (staleTime: 5 min | retry: 1 | cacheTime: 10 min)   │     │
│     │   ┌────────────────────────────────────────────────────┐   │     │
│     │   │      NavigationContainer (React Navigation)        │   │     │
│     │   │   ┌────────────────────────────────────────────┐   │   │     │
│     │   │   │              BottomTabNavigator            │   │   │     │
│     │   └───┼────────────────────┬───────────────────────┼───┘───┘     │
└─────────────┼────────────────────┼───────────────────────┼─────────────┘
              │                    │                       │
      ┌───────▼─────────┐  ┌───────▼─────────┐     ┌───────▼─────────┐
      │    MapScreen    │  │  EarningsScreen │     │  ProfileScreen  │
      │  (Radar Nativo) │  │(Extrato & KPIs) │     │ (Perfil & PIX)  │
      └───────┬─────────┘  └───────┬─────────┘     └───────┬─────────┘
              │                    │                       │
              └────────────────────┼───────────────────────┘
                                   │
                                   ▼
             ┌──────────────────────────────────────────┐
             │            @trampotaxa/shared            │
             │  • Types: GigOffer, User, ContractorGig  │
             │  • Utils: formatCurrency, formatCNPJ     │
             │  • Data: mockGigs, mockContractorData    │
             │  • API: Hooks Orval / React Query        │
             └──────────────────────────────────────────┘
```

### Roteiro de Implementação Passo a Passo

1. **Instalação de Dependências no `apps/mobile`:**
   - Adicionar `@tanstack/react-query`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context` e `react-native-maps`.
2. **Configuração de Resolução do Monorepo:**
   - Criar `apps/mobile/metro.config.js` com suporte a monorepo e `watchFolders`.
   - Criar `apps/mobile/tsconfig.json` mapeando `@trampotaxa/shared`.
3. **Estruturação do Ponto de Entrada (`apps/mobile/App.tsx`):**
   - Configurar `QueryClient` e `QueryClientProvider`.
   - Configurar `NavigationContainer` e abas inferiores customizadas no tema `#0A0B0E` e `#00E676`.
4. **Construção das Telas Nativas (`apps/mobile/src/screens/`):**
   - `MapScreen.tsx`: Mapa interativo com marcadores de taxas, cartões de detalhes e badges de valor.
   - `EarningsScreen.tsx`: Cards de resumo financeiro e `FlatList` com histórico de pagamentos PIX formatados via `formatCurrency`.
   - `ProfileScreen.tsx`: Perfil com métricas de reputação, pontualidade, dados bancários e alternador de perfil (Freelancer / Contratante).
5. **Verificação & Typecheck:**
   - Executar validação de compilação TypeScript no workspace mobile.
   - Garantir que `compile_applet` do monorepo continua passando com sucesso.
