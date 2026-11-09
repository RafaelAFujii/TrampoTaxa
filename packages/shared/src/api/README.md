# 📡 Generated API Layer (`packages/shared/src/api`)

Este módulo abriga os clientes HTTP e hooks tipados do [TanStack React Query](https://tanstack.com/query) gerados automaticamente pelo [Orval](https://orval.dev/) a partir da especificação formal `openapi.yaml`.

---

## 📋 Arquivos e Subdiretórios

| Caminho | Finalidade Técnica | Conteúdo Principal |
| :--- | :--- | :--- |
| **`index.ts`** | Ponto de entrada unificado da camada de API | Re-exporta todos os endpoints e models gerados |
| **`endpoints/`** | Funções de requisição HTTP e custom hooks React Query | Clientes divididos por tags do OpenAPI (autenticação, vagas, chat, relatórios, etc.) |
| **`model/`** | Interfaces e enums TypeScript de requisição e resposta | `AuthResponse`, `Gig`, `CreateGigInput`, `User`, `ChatMessage`... |

---

## 🏛️ Detalhamento dos Componentes

### 1. `endpoints/` — Hooks por Domínio
* **`autenticacao-usuarios/`**: `useLoginUser`, `useRegisterUser`, `useGetCurrentUser`
* **`taxas-vagas-gigs/`**: `useListGigs`, `useGetGigById`, `useCreateGig`
* **`candidaturas-selecao/`**: `useApplyToGig`, `useGetGigApplicants`, `useApproveApplicant`, `useRejectApplicant`
* **`avaliacoes-desempenho/`**: `useEvaluateGig`
* **`chat-operacao/`**: `useGetChatMessages`, `useSendChatMessage`
* **`relatorios-financeiro/`**: `useGetContractorReports`

### 2. `model/` — Schemas Canônicos
* Contém mais de 25 arquivos de tipagem estrita gerados diretamente dos schemas OpenAPI (`#/components/schemas`), garantindo que tanto a aplicação Web quanto o app Mobile estejam 100% alinhados com o contrato do backend.

### 3. Pipeline de Geração
Para regenerar este diretório após atualizar o arquivo `packages/shared/openapi.yaml`:
```bash
bun run api:generate
```
