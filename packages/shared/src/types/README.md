# 🏷️ Canonical Types (`packages/shared/src/types`)

Este diretório define as interfaces e tipos centrais do domínio de negócios do TrampoTaxa, compartilhados entre aplicações Web, Mobile e Backend.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Domínio Principal | Interfaces e Tipos Exportados |
| :--- | :--- | :--- |
| **`index.ts`** | Ponto de entrada central de tipos | Re-exportação unificada de todos os contratos de tipos |
| **`contractor.ts`** | Entidades e estados do Contratante | `ContractorGig`, `ContractorApplicant`, `ContractorKPIs`, `GigStatusFilter` |
| **`freelancerFlow.ts`** | Estados operacionais da jornada do Freelancer | `FreelancerGigFlowState`, `FreelancerShiftPhase`, `VenueReview` |

---

## 🏛️ Detalhamento dos Modelos de Domínio

### 1. `contractor.ts` — Gestão B2B
* **`ContractorGig`**: Modela a vaga sob a ótica do estabelecimento, incluindo contagem de vagas preenchidas, lista de candidatos vinculados e status operacional (`Aberta`, `Aguardando Confirmação`, `Preenchida`, `Finalizada`).
* **`ContractorApplicant`**: Modela o candidato com métricas de confiança (avaliação 1-5 estrelas, taxa de pontualidade e histórico de turnos).
* **`ContractorKPIs`**: Indicadores financeiros e gerenciais de volume de turnos, valor total pago e horas operadas.

### 2. `freelancerFlow.ts` — Máquina de Estados do Freelancer
* Modela todas as fases de um turno:
  * `NOT_STARTED`: Vaga visualizada ou selecionada.
  * `EN_ROUTE`: A caminho do local de trabalho.
  * `ARRIVED`: No estabelecimento aguardando check-in.
  * `CHECKED_IN`: Check-in validado via Master QR Code, turno em andamento.
  * `COMPLETED`: Turno concluído e check-out confirmado.
  * `DISPUTED`: Impasse operacional reportado com motivo formal.
