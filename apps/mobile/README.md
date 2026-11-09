# 📱 TrampoTaxa Mobile — Aplicativo Nativo Expo Go & React Native

Aplicativo móvel nativo do **TrampoTaxa (Loctaxa CWB)**, desenvolvido com **Expo (React Native)** e conectado ao pacote compartilhado `@trampotaxa/shared` no monorepo Bun.

---

## 🛠️ Stack Tecnológica Mobile

* **Framework:** [React Native 0.74](https://reactnative.dev/) & [Expo SDK 51](https://docs.expo.dev/)
* **Navegação Nativa:** [React Navigation](https://reactnavigation.org/) (`@react-navigation/bottom-tabs`)
* **Gerenciamento de Estado:** [TanStack React Query v5](https://tanstack.com/query) (`staleTime: 5min`)
* **Listas Performáticas:** `FlatList` com `RefreshControl` nativo (pull-to-refresh)
* **Contratos Compartilhados:** `@trampotaxa/shared` (tipagens, formatadores fiscais e dados mock)
* **Empacotador:** Metro Bundler configurado para o monorepo Bun (`metro.config.js`)

---

## 📁 Estrutura de Diretórios e Submódulos

```
apps/mobile/
├── navigation/                 # Navegação por abas e stacks nativas
│   ├── RootNavigator.tsx       # Navegador mestre com abas de Freelancer e Contratante
│   ├── authNavigation.ts       # Funções de redirecionamento de autenticação
│   ├── types.ts                # Tipagem estrita de rotas e parâmetros
│   └── README.md               # Documentação detalhada da navegação
│
├── src/
│   ├── api/                    # Cliente HTTP autenticado para dispositivos móveis
│   │   ├── authenticatedFetch.ts # Fetch com Bearer token e refresh automático
│   │   ├── useAuthenticatedFetch.ts # Hook React para chamadas seguras
│   │   └── README.md           # Documentação detalhada da camada de API
│   │
│   ├── context/                # Contextos de autenticação e fluxo móvel
│   │   ├── AuthContext.tsx     # Autenticação móvel com persistência segura
│   │   ├── FreelancerFlowContext.tsx # Fluxo de aceite, check-in e conclusão
│   │   ├── freelancerFlowState.ts # Transições de estado locais
│   │   ├── session.ts          # Abstração de armazenamento de credenciais
│   │   └── README.md           # Documentação detalhada dos contextos móveis
│   │
│   ├── hooks/                  # Hooks customizados nativos
│   │   └── useFreelancerGigFlow.ts # Orquestração do turno no mobile
│   │
│   ├── screens/                # Telas nativas de Freelancer e Contratante
│   │   ├── MapScreen.tsx       # Radar móvel de vagas georreferenciadas
│   │   ├── ActiveShiftScreen.tsx # Turno em andamento com cronômetro
│   │   ├── EarningsScreen.tsx  # Extrato financeiro mobile com PIX
│   │   ├── HighDopamineEarningsScreen.tsx # Tela comemorativa de pagamento
│   │   ├── ProfileScreen.tsx   # Perfil do profissional e avaliações
│   │   ├── ContractorGigsScreen.tsx # Painel de vagas do contratante
│   │   ├── CreateGigScreen.tsx # Criação rápida de vaga no smartphone
│   │   ├── ContractorReportsScreen.tsx # Relatórios de custos e horas B2B
│   │   ├── ContractorChatScreen.tsx # Chat nativo com freelancers
│   │   └── README.md           # Documentação detalhada de cada tela nativa
│   │
│   └── types/                  # Declarações de ambiente e tipos específicos
│
├── app.json                    # Configuração e permissões do Expo SDK 51
├── metro.config.js             # Resolução de symlinks e pacotes monorepo
└── tsconfig.json               # Configuração TypeScript Mobile
```

---

## 🧭 As Abas e Telas Nativas do Aplicativo

### 1. Visão do Freelancer
* **Radar de Vagas (`MapScreen.tsx`):** Marcadores interativos com chips de valor (`R$ 220,00`), filtros horizontais por função e alternador para FlatList com pull-to-refresh.
* **Turno Ativo (`ActiveShiftScreen.tsx`):** Informações de endereço, botão de contato com o gerente e validação de check-in via Master QR Code.
* **Extrato de Ganhos (`EarningsScreen.tsx`):** Cards de faturamento (*Hoje*, *Esta Semana*, *Este Mês*) e lista de turnos concluídos.
* **Celebração de Pagamento (`HighDopamineEarningsScreen.tsx`):** Animação e feedback de alta dopamina ao receber repasse de diária via PIX.
* **Perfil do Freelancer (`ProfileScreen.tsx`):** Dados de reputação (`4.9 ★`), pontualidade e chave PIX cadastrada.

### 2. Visão do Contratante (B2B)
* **Gestão de Vagas (`ContractorGigsScreen.tsx`):** Acompanhamento em tempo real das taxas abertas e candidatos.
* **Criação de Vagas (`CreateGigScreen.tsx`):** Cadastro simplificado de vagas emergenciais para o mesmo dia.
* **Relatórios (`ContractorReportsScreen.tsx`):** Indicadores de investimento em freelancers e horas contratadas.
* **Chat Móvel (`ContractorChatScreen.tsx`):** Comunicação instantânea com a equipe de salão/bar.

---

## 🚀 Guia Rápido: Como Executar no Smartphone via Expo Go

1. **Instalar o app Expo Go** na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [App Store](https://apps.apple.com/app/expo-go/id982107779).
2. Na raiz do monorepo, inicie o servidor Metro:
   ```bash
   bun run dev:mobile
   ```
3. Aponte a câmera do celular (iOS) ou use a opção "Scan QR Code" do Expo Go (Android).

---

## 🧪 Verificação de Tipos e Qualidade

```bash
# Executar a verificação estrita de tipagem TypeScript do app móvel
bun run typecheck:mobile
```

---

## 🔗 Navegação Modular

* Camada de API móvel: [src/api/README.md](./src/api/README.md)
* Contextos e sessão segura: [src/context/README.md](./src/context/README.md)
* Sistema de navegação e rotas: [navigation/README.md](./navigation/README.md)
* Catálogo de telas nativas: [src/screens/README.md](./src/screens/README.md)
