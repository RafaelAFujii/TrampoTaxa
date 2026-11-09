# 🧩 UI Components Layer (`apps/web/src/components`)

Este diretório contém os componentes de interface da aplicação Web TrampoTaxa, organizados por domínio funcional seguindo a metodologia atômica e responsiva.

---

## 📋 Arquivos e Subdiretórios

| Caminho / Arquivo | Domínio | Descrição Funcional |
| :--- | :--- | :--- |
| **`ErrorBoundary.tsx`** | Resiliência | Captura exceções de renderização do React e exibe fallback limpo com recarga de página |
| **`MobileFrame.tsx`** | Layout | Moldura simuladora de dispositivo móvel responsiva para visualização desktop e iFrame |
| **`chat/ManagerChatModal.tsx`** | Mensageria | Modal de chat instantâneo entre o profissional e o gerente do estabelecimento |
| **`flow/MasterQrScannerModal.tsx`** | Operação | Leitor/simulador de QR Code para validação de check-in e check-out de turno |
| **`flow/VenueReviewModal.tsx`** | Avaliação | Modal pós-turno com sistema de 1 a 5 estrelas e tags de feedback sobre o local |
| **`map/GigMarker.tsx`** | Geoespacial | Marcador interativo no mapa exibindo chip de valor (`R$ 220,00`) e animação de seleção |
| **`map/MapPlaceholder.tsx`** | Geoespacial | Fallback interativo vetorial (`MinimalVectorMap`) em SVG caso a API do Google Maps esteja indisponível |
| **`navigation/BottomNavigation.tsx`** | Navegação | Barra de abas inferior adaptativa para telas mobile e PWA |
| **`ui/PrimaryButton.tsx`** | Atômico | Botão principal estilizado com variantes neon verde e feedback de clique |
| **`ui/ProfessionToggle.tsx`** | Atômico | Seletor deslizante de profissão (*Bartender* / *Garçom*) |
| **`ui/TextInput.tsx`** | Atômico | Campo de entrada com suporte a ícones, validação visual e foco customizado |
| **`ui/SocialButton.tsx`** | Atômico | Botão para login social |
| **`ui/StatusBar.tsx`** | Atômico | Barra superior simulando indicadores do sistema operacional em modo frame |
| **`ui/HomeIndicator.tsx`** | Atômico | Barra inferior visual simulando o indicador home do smartphone |

---

## 🏛️ Boas Práticas e Diretrizes de Modificação

* **Tailwind CSS v4:** Todos os componentes devem utilizar exclusivamente classes utilitárias do Tailwind, sem estilos inline nem arquivos `.css` dedicados.
* **Acessibilidade:** Botões e elementos interativos possuem estados `:focus-visible` e rótulos `aria-label`.
* **Zero Mocking em Produção:** Modais e formulários devem consumir contratos reais via contexto ou hooks.
