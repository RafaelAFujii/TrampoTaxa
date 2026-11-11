# 🛠️ Shared Utilities & Zustand Stores (`packages/shared/src/utils`)

Este diretório contém funções utilitárias puras, validadores fiscais, formatadores e as **Stores Globais do Zustand** que orquestram a inteligência de negócios de todo o monorepo TrampoTaxa.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Finalidade Técnica | Funções / Stores Principais | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`freelancerFlowState.ts`** | Store Zustand da jornada do freelancer e máquina de estados de turno | `useFreelancerFlowStore`, `useFreelancerGigFlow`, controle de overbooking (máx 3), validação `QR_MESTRE_123` | `freelancer_flow.test.ts` |
| **`contractorState.ts`** | Store Zustand do contratante e métricas financeiras | `useContractorStore`, `useContractor`, `calculateContractorKPIs`, aprovações e chat | `contractor.test.ts` |
| **`formatters.ts`** | Validação fiscal e formatação de dados brasileiros | `formatCurrency`, `formatCurrencyBRL`, `formatCNPJ`, `formatCPF`, `formatPhoneBR`, `isValidCNPJ` (Módulo 11) | `formatters.test.ts` |
| **`gigs.ts`** | Cálculos de distância e filtragem geoespacial | `calculateHaversineDistance`, `filterGigsByDistance`, `sortGigsByUrgency` | Testes do pacote |

---

## 🏛️ Detalhamento dos Módulos

### 1. `freelancerFlowState.ts` — Governança de Turnos do Freelancer
* Implementa a store Zustand que substituiu os antigos React Contexts.
* **Overbooking**: Bloqueia a candidatura se o usuário já tiver 3 vagas com status pendente ou aprovado.
* **QR Code Mestre**: Valida o código físico `QR_MESTRE_123` no momento do check-in.
* **Auto Check-out**: Controla a janela de contestação de 2 horas e as fases (`idle` -> `candidatado` -> `aprovado` -> `em_turno` -> `checkout_pendente` -> `pix_agendado`).

### 2. `contractorState.ts` — Painel do Contratante e Métricas B2B
* Gerencia o estado de vagas criadas pelo estabelecimento, candidatos em triagem e mensagens de chat.
* **KPIs Reativos**: Calcula dinamicamente o valor total investido em taxas finalizadas, número de profissionais contratados e nota de pontualidade.
* Fornece simulação resiliente de respostas de chat para experiência em tempo real.

### 3. `formatters.ts` — Regras Fiscais Brasileiras
* **`isValidCNPJ`**: Algoritmo oficial de dígitos verificadores Módulo 11 da Receita Federal.
* **`formatCurrency`**: Formata números e strings para o padrão monetário brasileiro `R$ 0,00` usando `Intl.NumberFormat('pt-BR')`.
* **Máscaras de Telefone e Documentos**: Telefones móveis/fixos (`(41) 99999-9999`) e CNPJ (`00.000.000/0000-00`).

### 4. `gigs.ts` — Inteligência Geoespacial
* Fórmula de Haversine para cálculo de distância em quilômetros entre a localização do usuário e os pontos gastronômicos de Curitiba.
