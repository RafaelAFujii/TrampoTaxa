# 🔄 Mobile State & Contexts (`apps/mobile/src/context`)

Este diretório gerencia o estado global, persistência de credenciais e a máquina de estados operacionais para o aplicativo móvel nativo.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Componente / Módulo | Responsabilidade Central | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`AuthContext.tsx`** | `AuthContext` / `useAuth` | Provedor de autenticação móvel com login, logout e sincronização com a sessão persistida | `AuthContext.test.tsx` |
| **`FreelancerFlowContext.tsx`** | `FreelancerFlowContext` / `useFreelancerFlow` | Máquina de estados móvel para o turno do profissional (aceite, deslocamento, check-in e check-out) | N/A |
| **`freelancerFlowState.ts`** | Lógica de Transição | Funções puras de transição de fase de turno e verificação de integridade | `freelancerFlowState.test.ts` |
| **`session.ts`** | Persistência de Sessão | Armazenamento de tokens em memória e AsyncStorage / SecureStore | N/A |

---

## 🏛️ Detalhamento dos Componentes

### 1. `AuthContext.tsx` & `session.ts`
* Inicializa o aplicativo verificando a existência de um token previamente salvo no armazenamento nativo.
* Controla o estado de `isLoading` para exibir a tela de splash nativa enquanto as credenciais são validadas.
* Limpa a sessão de forma segura ao acionar `signOut()`.

### 2. `FreelancerFlowContext.tsx` & `freelancerFlowState.ts`
* Sincroniza o status do turno ativo em tempo real no smartphone do profissional.
* Garante que transições entre `NOT_STARTED` -> `EN_ROUTE` -> `CHECKED_IN` -> `COMPLETED` respeitem a máquina de estados canônica do `@trampotaxa/shared`.
