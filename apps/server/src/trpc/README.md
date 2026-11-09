# ⚡ tRPC Infrastructure & Security Layer (`apps/server/src/trpc`)

Este módulo gerencia a infraestrutura central do **tRPC v11**, incluindo a inicialização da instância tRPC, criação de contexto com extração de credenciais Bearer JWT e controle de acesso baseado em papéis (RBAC).

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Finalidade Técnica | Exportações Principais | Dependências Chave |
| :--- | :--- | :--- | :--- |
| **`init.ts`** | Inicialização do tRPC, formatador de erros Zod e middlewares de segurança | `router`, `middleware`, `publicProcedure`, `protectedProcedure`, `contractorProcedure`, `freelancerProcedure` | `@trpc/server`, `./context` |
| **`context.ts`** | Fábrica do contexto de requisição HTTP com resolução do usuário autenticado | `createContext`, `Context` | `@trpc/server/adapters/fetch`, `../db/client` |

---

## 🏛️ Detalhamento dos Componentes

### 1. `init.ts` — Middlewares e Níveis de Acesso (RBAC)
* **`publicProcedure`**: Permite acesso irrestrito sem necessidade de cabeçalhos de autenticação (usado para login, registro e listagem pública de vagas no radar).
* **`protectedProcedure`**: Exige cabeçalho `Authorization: Bearer <token>`. Rejeita a requisição com código `UNAUTHORIZED (401)` caso o usuário não seja identificado.
* **`contractorProcedure`**: Extensão de `protectedProcedure`. Exige obrigatoriamente que `ctx.user.role === 'Contratante'`, rejeitando qualquer outro perfil com código `FORBIDDEN (403)`.
* **`freelancerProcedure`**: Extensão de `protectedProcedure`. Exige obrigatoriamente que `ctx.user.role === 'Freelancer'`, rejeitando requisições não autorizadas com código `FORBIDDEN (403)`.
* **Formatador de Erros Zod**: Serializa erros de validação de schema para que os clientes frontend recebam detalhes exatos dos campos inválidos.

### 2. `context.ts` — Ciclo de Vida da Requisição
* **Extração de Bearer Token**: Lê o cabeçalho `Authorization` da requisição HTTP.
* **Validação de Token**:
  * Decodifica tokens JWT reais extraindo o claim de identificação (`sub` / `id`).
  * Suporta tokens de teste determinísticos em ambiente de desenvolvimento (`contractor-token-123`, `freelancer-token-123`).
* **Injeção de Usuário**: Busca a entidade correspondente no banco e a disponibiliza em `ctx.user` para todas as procedures subsequentes.
