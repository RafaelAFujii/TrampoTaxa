# Correção de Layout de Altura Total do Mapa e Remoção de Botão Flutuante

Correção arquitetural no layout do Radar/Mapa (`MapDashboardScreen`), garantindo que o mapa ocupe 100% da área útil do viewport sem faixas em branco — com rolagem interna independente na coluna lateral de vagas — e remoção definitiva do botão de alternância de perfil (`switchRole`) posicionado sobre o mapa.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões confirmadas com o usuário na Fase 1:**
> 1. **Comportamento do Mapa e Sidebar de Vagas:** Layout com altura total fixa (`100%` da altura restante da janela, `h-[calc(100vh-4rem)]` / `h-full min-h-0`), onde a barra lateral de vagas possui rolagem interna independente (`overflow-y-auto`) sem expandir a página nem deixar faixas em branco abaixo do mapa.
> 2. **Remoção do Botão Flutuante de Perfil:** Remoção total do botão de teste de alternância de papel (`Perfil: Freelancer / Contratante`) que estava posicionado na camada de controle superior sobre o mapa no `MapDashboardScreen.tsx`.

---

## 1. Overview & Core Concept

- **O que faz:**
  1. **Resolve o bug da faixa em branco no Mapa:** Ajusta a cadeia hierárquica do Flexbox (`AppLayout` -> `main` -> `MapDashboardScreen` -> `aside` + `main` + `MapPlaceholder`), aplicando `min-h-0`, `h-full` e `overflow-hidden`. A lista de vagas passa a ter scroll interno estrito na sidebar esquerda, mantendo o mapa sempre preenchendo 100% da altura e largura da tela direita, independentemente da quantidade de taxas disponíveis.
  2. **Remove o botão flutuante de perfil:** Elimina o botão residual `switchRole` na camada flutuante de controles do mapa (`MapDashboardScreen.tsx`), limpando a visão aérea de Curitiba.
- **Público-Alvo:** Freelancers navegando pelo radar de vagas em desktops, tablets e smartphones, com visualização fluida e mapa ocupando toda a tela.
- **Benefício Chave:** Estabilidade visual de produção, fim de barras de rolagem globais indesejadas e eliminação de áreas em branco.

---

## 2. User Experience & Visual Design

- **Layout de Tela Cheia do Radar (Desktop):**
  - Coluna Esquerda (Sidebar): Largura fixa de 24rem (384px), altura travada em 100% da viewport útil (`h-full min-h-0`), com cabeçalho de perfil/saldo fixo, barra de filtros e lista de vagas com scroll suave (`overflow-y-auto custom-scrollbar`).
  - Coluna Direita (Mapa): Ocupa 100% do espaço restante (`flex-1 h-full min-h-0`), sem margens, sem rolagem e sem faixas em branco no rodapé.
- **Camada Flutuante Superior:**
  - Mantém apenas o badge funcional de status do radar (`ONLINE` / `OFFLINE`) e o alternador móvel (`Ver Lista` / `Ver Mapa`), sem botões de debug de perfil.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisão 1: Encadeamento de Flexbox com `min-h-0`**
  - *Abordagem:* No CSS Flexbox moderno, filhos flexíveis (`flex-1`) com conteúdo longo expandem por padrão para o tamanho do conteúdo (`min-height: auto`). A aplicação de `min-h-0` e `overflow-hidden` nos contêineres pais (`AppLayout` e `MapDashboardScreen`) força o container a respeitar o limite de altura da janela, ativando a rolagem interna da lista de vagas.
  - *Por que:* É a solução canônica e definitiva para o bug da "faixa em branco", garantindo que tanto o mapa do Google quanto o mapa vetorial preencham perfeitamente a área visível.

- **Decisão 2: Remoção do Botão `UserCheck` / `switchRole` no Mapa**
  - *Abordagem:* Remoção completa da `div` `pointer-events-auto hidden sm:flex items-center gap-2` em `MapDashboardScreen.tsx` e limpeza de importações não utilizadas (`UserCheck`, `switchRole`).
  - *Por que:* Alinha o radar com a diretriz de produção limpa sem atalhos de depuração.

---

## 4. Technical Architecture & Data Strategy

### Diagrama Estrutural do Flexbox Corrigido

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AppLayout (h-screen, overflow-hidden)           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Header (h-16 shrink-0)                                           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Main Content Area (flex-1 min-h-0 overflow-hidden relative)      │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ MapDashboardScreen (flex-1 h-full min-h-0 flex-row)        │  │  │
│  │  │  ┌────────────────────────┐  ┌──────────────────────────┐  │  │  │
│  │  │  │ Sidebar (w-96, h-full) │  │ Map Area (flex-1, h-full)│  │  │  │
│  │  │  │ • Header fixo          │  │ • Full bleed map         │  │  │  │
│  │  │  │ • Filtros fixos        │  │ • Sem faixa em branco    │  │  │  │
│  │  │  │ • Lista (overflow-y)   │  │ • Badge Online flutuante │  │  │  │
│  │  │  │ • Botão Ligar/Desligar │  │ • Controles de Zoom      │  │  │  │
│  │  │  └────────────────────────┘  └──────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Arquivos a Modificar:
1. `apps/web/src/layouts/AppLayout.tsx`: Garantir `h-screen overflow-hidden` no container raiz e `flex-1 min-h-0 overflow-hidden` na tag `<main>`.
2. `apps/web/src/screens/MapDashboardScreen.tsx`:
   - Atualizar container raiz para `flex-1 h-full min-h-0 overflow-hidden`.
   - Atualizar `<aside>` e `<main>` para `h-full min-h-0 overflow-hidden`.
   - Remover o botão flutuante de troca de perfil e importações órfãs (`UserCheck`, `switchRole`).
3. `apps/web/src/components/map/MapPlaceholder.tsx`: Garantir que o container use `h-full min-h-0` para preencher perfeitamente seu elemento pai.
