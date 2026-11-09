# 🛠️ Shared Utilities (`packages/shared/src/utils`)

Este diretório contém funções utilitárias puras, validadores fiscais, formatadores de moeda/documentos e lógica matemática compartilhada no ecossistema TrampoTaxa.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Finalidade Técnica | Funções Principais | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`formatters.ts`** | Validação fiscal e formatação de dados brasileiros | `formatCurrencyBRL`, `formatCNPJ`, `formatCPF`, `formatPhoneBR`, `isValidCNPJ` (Módulo 11) | `formatters.test.ts` |
| **`freelancerFlowState.ts`** | Regras de transição e validação da máquina de estados de turno | `canTransitionShiftPhase`, `getNextAllowedPhases`, `resolveAutoCheckout` | `freelancerFlowState.test.ts` |
| **`gigs.ts`** | Cálculos de distância e filtragem geoespacial | `calculateHaversineDistance`, `filterGigsByDistance`, `sortGigsByUrgency` | `gigs.test.ts` |

---

## 🏛️ Detalhamento dos Utilitários

### 1. `formatters.ts` — Regras Fiscais Brasileiras
* **`isValidCNPJ`**: Implementa o algoritmo oficial de dígitos verificadores Módulo 11 da Receita Federal, rejeitando sequências nulas e dígitos incorretos.
* **`formatCurrencyBRL`**: Formata números e strings para o padrão monetário brasileiro `R$ 0,00` usando `Intl.NumberFormat('pt-BR')`.
* **Máscaras de Telefone e Documentos**: Formatação dinâmica de telefones móveis e fixos (`(41) 99999-9999`) e CNPJs (`00.000.000/0000-00`).

### 2. `freelancerFlowState.ts` — Governança de Turnos
* Assegura que nenhuma transição inválida ocorra (ex: tentar fazer check-out sem ter feito check-in prévio).
* Calcula prazos de tolerância para auto check-out após o horário previsto de término do turno.

### 3. `gigs.ts` — Inteligência Geoespacial
* Utiliza a fórmula de Haversine para calcular a distância em quilômetros entre a localização atual do usuário e as vagas disponíveis em Curitiba.
