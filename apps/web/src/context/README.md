# 🔄 State Contexts (`apps/web/src/context`)

Este diretório abriga os provedores de contexto global (React Context API) responsáveis pelo gerenciamento da sessão do usuário, controle de permissões (RBAC) e orquestração do ciclo operacional de vagas.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Contexto Provido | Responsabilidade Central | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`AuthContext.tsx`** | `AuthContext` / `useAuth` | Sessão JWT, controle de acesso baseado em papéis (`Freelancer` vs `Contratante`), persistência no `localStorage` | `auth_flow.test.ts` |
| **`ContractorContext.tsx`** | `ContractorContext` / `useContractor` | Gerenciamento de vagas do estabelecimento, triagem de candidatos, aprovações e relatórios B2B | `contractor.test.ts` |
| **`FreelancerFlowContext.tsx`** | `FreelancerFlowContext` / `useFreelancerFlow` | Máquina de estados do turno do freelancer: aceite, deslocamento, check-in QR Code, conclusão e avaliação | `freelancer_flow.test.ts` |

---

## 🏛️ Detalhamento dos Provedores

### 1. `AuthContext.tsx` — Identidade e Sessão
* **Papéis Oficiais:** `Freelancer` e `Contratante`.
* **Segurança Fail-Closed:** Não permite transições de perfil não autorizadas; rotas e ações protegidas são validadas de forma estrita.
* **Persistência:** Sincroniza o token de autenticação e os dados do usuário com o armazenamento local do navegador.

### 2. `ContractorContext.tsx` — Operações B2B
* Centraliza as listas de vagas abertas e candidatos inscritos.
* Provê métodos atômicos para:
  * `createGig`: Publicação instantânea de novas taxas.
  * `approveCandidate`: Aprova o candidato selecionado e dispara o fechamento de vaga.
  * `rejectCandidate`: Recusa o candidato de forma silenciosa.

### 3. `FreelancerFlowContext.tsx` — Jornada de Turno
* Controla a máquina de estados do turno do profissional autônomo.
* Garante a sincronia de etapas:
  * Deslocamento até o local (`EN_ROUTE`).
  * Chegada e leitura do Master QR Code para check-in (`CHECKED_IN`).
  * Conclusão de turno com auto check-out e modal de avaliação do bar (`COMPLETED`).
