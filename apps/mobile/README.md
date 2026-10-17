# 📱 TrampoTaxa Mobile — Aplicativo Nativo Expo & React Native

Aplicativo móvel nativo do **TrampoTaxa (Loctaxa)**, construído com **Expo (React Native)** e conectado diretamente ao pacote compartilhado `@trampotaxa/shared` dentro do monorepo Bun.

---

## 🛠️ Stack Tecnológica Mobile

* **Framework:** [React Native 0.74](https://reactnative.dev/) & [Expo SDK 51](https://docs.expo.dev/)
* **Navegação Nativa:** [React Navigation v6/v7](https://reactnavigation.org/) (`@react-navigation/native` & `@react-navigation/bottom-tabs`)
* **Gerenciamento de Estado Assíncrono:** [TanStack React Query v5](https://tanstack.com/query) (`staleTime: 5min`, `retry: 1`)
* **Mapas Nativos:** `react-native-maps` com suporte a geolocalização e marcadores personalizados
* **Lógica Compartilhada:** `@trampotaxa/shared` (tipagens unificadas e formatadores fiscais); fixtures somente via `@trampotaxa/shared/mocks` em desenvolvimento/testes
* **Resolução Monorepo:** Metro Bundler configurado com `watchFolders` e `extraNodeModules`

---

## 🎯 Telas e Funcionalidades Nativas

### 1. Radar de Vagas (`MapScreen.tsx`)
- **Visualização Nativa de Mapa:** Renderiza `MapView` centrado em Curitiba (Batel/Centro) com chips de valor (`R$ 220,00`) e marcadores interativos com a cor tema `#00E676`.
- **Filtros Ágeis:** Filtro horizontal de funções (*Todos*, *Bartender*, *Garçom*) atualizando a renderização em tempo real.
- **Card Flutuante & Candidatura:** Toque no marcador para exibir o resumo da vaga e botão de candidatura imediata.
- **Resiliência e Fallback:** Se executado em ambiente sem chaves de API externas ou emuladores simplificados, oferece alternador para visualização em Lista de Oportunidades nativa.
- **Feedback de Rede:** Estados elegantes com `ActivityIndicator` nativo e banner de erro com tentativa de reconexão.

### 2. Relatórios & Fechamentos (`EarningsScreen.tsx`)
- **KPIs Financeiros:** Cards de faturamento no topo (*Hoje*, *Esta Semana*, *Este Mês*).
- **Lista Nativa com Performance:** Renderização via `FlatList` com `RefreshControl` nativo (pull-to-refresh) conectado ao `refetch()` do React Query.
- **Formatação de Moeda:** Utilização da função `formatCurrency(amount)` de `@trampotaxa/shared` para exibição consistente de valores em Real (BRL).
- **Banner de Status PIX:** Identificação da chave PIX ativa para repasse imediato pós-turno.

### 3. Perfil do Usuário (`ProfileScreen.tsx`)
- **Visão do Freelancer:** Exibe avaliação geral por estrelas (`4.9 ★`), total de turnos (`48`), pontualidade (`99%`), especialidades de balcão e status de disponibilidade no radar (*Disponível* / *Pausado*).
- **Alternador de Perfil Dinâmico:** Botão de troca ágil para o **Modo Contratante**, permitindo gerenciar dados cadastrais da empresa com validação de CNPJ (`formatCNPJ`) e telefone (`formatPhone`).

---

## 🏗️ Integração com o Monorepo (Bun + Metro)

O aplicativo resolve `@trampotaxa/shared` diretamente dos fontes TypeScript sem necessidade de etapas manuais de build:
`@trampotaxa/shared/mocks` fica reservado a testes e fallbacks de desenvolvimento.

### Sessão e navegação protegidas

- `AuthProvider` restaura e persiste o JWT usando `expo-secure-store`; falhas de armazenamento são reportadas e mantêm a sessão não autenticada.
- `navigation/RootNavigator.tsx` só monta as abas Mapa, Ganhos e Perfil após a restauração confirmar uma sessão autenticada.
- Use `useAuthenticatedFetch` para as chamadas Mobile: ele identifica as operações privadas definidas no contrato OpenAPI, envia o bearer token apenas nessas operações e encerra a sessão após uma resposta `401`.
- O fluxo de login do servidor continua fora deste escopo; `signIn(token)` fornece a entrada para a futura tela de autenticação.

```
┌──────────────────────────────────────────────┐
│             apps/mobile/App.tsx              │
│       ┌──────────────────────────────┐       │
│       │     QueryClientProvider      │       │
│       │   (TanStack React Query)     │       │
│       └──────────────┬───────────────┘       │
│                      │                       │
│       ┌──────────────▼──────────────┐        │
│       │      BottomTabNavigator     │        │
│       │  [Radar] [Ganhos] [Perfil]   │        │
│       └──────────────┬───────────────┘       │
└──────────────────────┼───────────────────────┘
                       │
                       │ import from "@trampotaxa/shared"
                       ▼
       ┌─────────────────────────────────┐
       │        packages/shared/         │
       │  • Types (GigOffer, User)       │
       │  • Formatters (formatCurrency)  │
       │  • API Hooks (Orval)            │
       └─────────────────────────────────┘
```

A configuração em `apps/mobile/metro.config.js` garante que o empacotador monitore todo o monorepo:
```javascript
config.watchFolders = [monorepoRoot];
config.resolver.extraNodeModules = {
  '@trampotaxa/shared': path.resolve(monorepoRoot, 'packages/shared/src'),
};
```

---

## 🚀 Como Executar no Smartphone com Expo Go

### Pré-requisitos
1. Smartphone com o app **Expo Go** instalado ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS](https://apps.apple.com/app/expo-go/id982107779)).
2. Computador e smartphone conectados à mesma rede Wi-Fi (ou usar `--tunnel`).

### Comandos de Inicialização

A partir da raiz do monorepo:

```bash
# Iniciar o servidor Metro do Expo
bun run dev:mobile
# ou
npm --prefix apps/mobile run start

# Iniciar com conexão em modo túnel (caso redes Wi-Fi sejam diferentes)
cd apps/mobile && npx expo start --tunnel
```

Aponte a câmera do celular (iOS) ou o leitor de QR Code do app Expo Go (Android) para o terminal.

---

## 📦 Como Gerar o Instalador APK (Android)

Para compilar o instalador nativo `.apk`:

```bash
cd apps/mobile

# Login no serviço oficial Expo Application Services (EAS)
bunx eas login

# Gerar compilação para testes em dispositivo físico
bunx eas build -p android --profile preview
```

---

## 🧪 Verificação de Tipos e Qualidade

```bash
# Executar verificação de tipagem TypeScript no mobile
bun run typecheck:mobile
# ou
npm --prefix apps/mobile run typecheck
```
