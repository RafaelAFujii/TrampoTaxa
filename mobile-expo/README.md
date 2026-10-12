# 📱 TrampoTaxa Mobile — Versão Expo Go & React Native

Este diretório contém a estrutura da aplicação móvel do **TrampoTaxa (Loctaxa)**, configurada com o ecossistema **Expo (React Native)** para permitir execução e testes instantâneos no celular através do **Expo Go** (Android e iOS), além de possibilitar a geração de instaladores nativos (**`.apk`** e **`.ipa`**).

---

## 🎯 Objetivo da Camada Mobile

1. **Execução Imediata no Expo Go:** Testar a experiência completa da aplicação em smartphones reais sem necessidade de compilação demorada de Android Studio ou Xcode.
2. **Sensação Nativa (App Experience):**
   * Remoção total de barras de endereços ou controles de navegador.
   * Integração com a barra de status do sistema operacional (`StatusBar` escura `#0A0B0E`).
   * Suporte ao botão físico de "Voltar" do Android (`BackHandler`).
   * Geolocalização via GPS nativo e gestos táteis.
3. **Reaproveitamento de Código:** Compartilhamento direto de toda a lógica em TypeScript desenvolvida para a Web (`tipagens`, `validadores fiscais`, `formatadores de moeda` e `regras de negócio`).

---

## 🚀 Como Executar no Celular com o Expo Go

### 1. Pré-requisitos
* **Node.js** (versão 18 ou superior).
* Smartphone com o app **Expo Go** instalado:
  * [Baixar na Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  * [Baixar na Apple App Store (iPhone / iPad)](https://apps.apple.com/app/expo-go/id982107779)

---

### 2. Passo a Passo de Execução

1. **Acesse a pasta mobile:**
   ```bash
   cd mobile-expo
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```
   *(Um QR Code grande aparecerá no terminal do seu computador).*

4. **Abra o app no celular:**
   * **No Android:** Abra o aplicativo **Expo Go**, toque em **"Scan QR code"** e aponte a câmera para o QR Code do terminal.
   * **No iPhone (iOS):** Abra a **Câmera padrão do iPhone**, aponte para o QR Code e toque no banner amarelo para abrir com o **Expo Go**.

> 💡 **Dica de Conexão:** Caso o seu celular e computador estejam em redes Wi-Fi diferentes ou o celular não encontre o servidor local, use o modo túnel:
> ```bash
> npx expo start --tunnel
> ```

---

## 📦 Como Gerar o Arquivo Instalador APK (Android)

Se você desejar gerar o arquivo instalador **`.apk`** para enviar via WhatsApp ou instalar diretamente no celular sem depender do Expo Go:

### Opção 1: Via EAS Build (Serviço Oficial do Expo na Nuvem)
1. Instale o CLI do EAS:
   ```bash
   npm install -g eas-cli
   ```
2. Faça login na sua conta gratuita do Expo:
   ```bash
   eas login
   ```
3. Configure e gere a build do APK para testes locais:
   ```bash
   eas build -p android --profile preview
   ```
   *O Expo compilará o `.apk` na nuvem e fornecerá o link direto para download no final.*

---

## 📂 Estrutura de Arquivos

```
mobile-expo/
├── assets/                  # Ícones e splash screens móveis
├── App.tsx                  # Ponto de entrada React Native com container nativo e WebView
├── app.json                 # Configurações do Expo (nome, pacote android, orientação)
├── package.json             # Dependências (expo, react-native, react-native-webview)
└── README.md                # Este guia de documentação da versão mobile
```

---

## 🔄 Estratégia de Compartilhamento de Código com a Web

O ecossistema foi projetado para que a equipe de engenharia não precise reescrever o código duas vezes:

| Módulo | Localização | Compatibilidade com React Native |
| :--- | :--- | :---: |
| **Interfaces & Modelos** | `../src/types/` | 100% Compartilhável |
| **Validador de CNPJ (Módulo 11)** | `../src/utils/formatters.ts` | 100% Compartilhável |
| **Formatação de Moeda & Telefone** | `../src/utils/formatters.ts` | 100% Compartilhável |
| **Modelos de Vagas e Mock Data** | `../src/data/` | 100% Compartilhável |
| **Controle de Estado (Auth / Vagas)** | `../src/context/` | 100% Compartilhável |

---

## 🛠️ Scripts Disponíveis

* `npm run start`: Inicia o servidor Expo Metro Bundler.
* `npm run android`: Inicia o servidor e abre no emulador Android conectado.
* `npm run ios`: Inicia o servidor e abre no simulador iOS (macOS).
* `npm run web`: Executa a versão de testes no navegador.
