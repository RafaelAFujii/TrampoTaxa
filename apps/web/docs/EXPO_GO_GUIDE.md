# 📱 Guia de Execução no Expo Go — TrampoTaxa

Este guia explica como abrir e testar o **TrampoTaxa** diretamente no aplicativo **Expo Go** do seu celular (Android ou iPhone) em menos de 2 minutos, sem precisar reprogramar as telas.

---

## 1. O que é o Expo Go?

O **Expo Go** é um aplicativo móvel gratuito (disponível na [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) e na [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)) que permite rodar aplicações mobile instantaneamente apenas **escaneando um QR Code gerado pelo terminal**, sem precisar compilar APK ou configurar o Android Studio / Xcode.

---

## 2. Passo a Passo Rápido (Menos de 2 Minutos)

### Passo 1: Baixar o Expo Go no seu celular
* **No Android:** Abra a Google Play Store e instale o **Expo Go**.
* **No iPhone:** Abra a App Store e instale o **Expo Go**.

### Passo 2: Iniciar o Container Expo no seu computador
No terminal da raiz do projeto, acesse a pasta `mobile-expo` que já deixamos configurada:

```bash
cd mobile-expo
npm install
npx expo start
```

### Passo 3: Escanear o QR Code no Celular
* **No Android:**
  1. Abra o app **Expo Go**.
  2. Toque em **"Scan QR Code"** e aponte a câmera para o QR Code exibido no terminal do seu computador.
* **No iPhone (iOS):**
  1. Abra a **Câmera padrão do iPhone**.
  2. Aponte para o QR Code do terminal.
  3. Toque na notificação amarela que sugere abrir no aplicativo **Expo Go**.

---

## 3. O que acontece quando abre no Expo Go?

1. O Expo inicializa o container nativo com barra de status escura (`#0A0B0E`), orientação vertical travada e tela cheia sem barras de navegador.
2. A aplicação carrega a interface com suporte a geolocalização, gestos de toque, transições fluidas e o mapa de taxas em tempo real.
3. O botão físico de **"Voltar"** dos aparelhos Android é tratado nativamente para navegar entre as telas e abas.

---

## 4. Reutilização de Código entre Web e Mobile

Se você desejar transformar as telas em componentes 100% nativos (`<View>`, `<Text>`, `<TouchableOpacity>`) no futuro:
* **80% do código já está pronto:**
  * Toda a camada de validação fiscal (`src/utils/formatters.ts`) roda sem alterações.
  * Todas as tipagens e interfaces (`src/types/`) são idênticas.
  * Toda a base de dados mockada e gerenciamento de estado (`src/data/`, `src/context/`) funciona nativamente em React Native.
