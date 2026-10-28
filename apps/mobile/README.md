# 📱 TrampoTaxa Mobile — Aplicativo Nativo Expo Go

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

## 🧭 As 3 Abas Nativas do Aplicativo

1. **Radar de Vagas (`MapScreen.tsx`):**
   - Visualização com marcadores interativos com chips de valor (`R$ 220,00`).
   - Filtros horizontais por cargo (*Todos*, *Bartender*, *Garçom*).
   - Alternador para Lista de Oportunidades com pull-to-refresh para atualização em tempo real.
2. **Extrato de Ganhos (`EarningsScreen.tsx`):**
   - Cards de faturamento no topo (*Hoje*, *Esta Semana*, *Este Mês*).
   - Lista nativa de turnos realizados com valores formatados em Real (`formatCurrency`) e status de repasse PIX.
3. **Perfil do Freelancer (`ProfileScreen.tsx`):**
   - Dados operacionais: avaliação média por estrelas (`4.9 ★`), turnos concluídos e índice de pontualidade.
   - Status de disponibilidade no radar (*Disponível* / *Pausado*) e chave PIX cadastrada.

---

## 🚀 Guia Rápido: Como Executar no Smartphone via Expo Go

Não é necessário instalar Android Studio nem Xcode para testar o aplicativo no seu dispositivo móvel.

### Passo 1: Instalar o app Expo Go
* **Android:** Baixar na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
* **iOS (iPhone):** Baixar na [App Store](https://apps.apple.com/app/expo-go/id982107779).

### Passo 2: Iniciar o servidor Metro

Na raiz do monorepo TrampoTaxa:

```bash
# Iniciar o servidor Metro do Expo
bun run dev:mobile
```

### Passo 3: Abrir no celular
1. Certifique-se de que o computador e o smartphone estão conectados à **mesma rede Wi-Fi**.
2. **No Android:** Abra o app Expo Go e toque em **"Scan QR Code"**, apontando para o terminal.
3. **No iOS:** Abra a câmera nativa do iPhone, aponte para o QR Code do terminal e toque na notificação para abrir no Expo Go.

> 💡 **Dica (Redes Diferentes):** Se o computador e o celular estiverem em conexões diferentes (ex: 4G/5G no celular), execute em modo túnel:
> ```bash
> cd apps/mobile && npx expo start --tunnel
> ```

---

## 🧪 Verificação de Tipos e Qualidade

O aplicativo possui checagem rigorosa de tipos TypeScript integrada ao compilador da Web:

```bash
# Executar a verificação estrita de tipagem (0 erros)
bun run typecheck:mobile
```

---

## 🔧 Troubleshooting Mobile

* **Erro de conexão ao ler o QR Code:** Use a flag `--tunnel` mencionada acima.
* **Cache preso do Metro:** Execute `cd apps/mobile && npx expo start -c` para limpar o cache de compilação.
