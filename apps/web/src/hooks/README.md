# 🎣 Custom Hooks (`apps/web/src/hooks`)

Este diretório contém hooks customizados que encapsulam regras de negócio, consultas cacheadas e sincronização de dados no frontend Web.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Hook Exportado | Propósito Técnico |
| :--- | :--- | :--- |
| **`useFreelancerGigFlow.ts`** | `useFreelancerGigFlow` | Orquestra a jornada operacional do freelancer, sincronizando estados com o backend e gerenciando tempos de turno |
| **`useGigsQuery.ts`** | `useGigsQuery` | Gerencia a busca, cache e atualização de vagas com TanStack React Query v5 e fallback resiliente |

---

## 🏛️ Detalhamento dos Hooks

### 1. `useFreelancerGigFlow.ts`
* Conecta a interface gráfica com o `FreelancerFlowContext`.
* Fornece ações simplificadas para botões de tela:
  * `startRoute()`: Notifica o estabelecimento que o freelancer está a caminho.
  * `scanQrCode(code)`: Valida o código do estabelecimento e registra o check-in.
  * `finishShift()`: Encerra o turno e abre o modal de avaliação.

### 2. `useGigsQuery.ts`
* Consulta vagas aplicando filtros de profissão (*Bartender*, *Garçom*) e raio de busca em Curitiba.
* Configura políticas de cache inteligente (`staleTime: 5min`) para otimizar a experiência em conexões 4G/5G instáveis.
