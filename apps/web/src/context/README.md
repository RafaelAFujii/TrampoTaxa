# 🔐 Web Contexts (`apps/web/src/context`)

Este diretório contém unicamente os contextos estáticos de sessão e autenticação de nível superior, em estrita conformidade com a Constituição v2 do projeto (**Zero Context API para estados mutáveis complexos**).

---

## 📋 Arquivos do Diretório

| Arquivo | Finalidade Técnica | Responsabilidade |
| :--- | :--- | :--- |
| **`AuthContext.tsx`** | Provedor de Autenticação e Sessão JWT | Gerencia o token da sessão, o papel do usuário logado (Freelancer / Contratante) e o carregamento do perfil. |

---

## ⚠️ Regra Arquitetural de Estado (Constitution v2.0)

Conforme ratificado na Constituição do monorepo:
* **Estados Mutáveis de Negócio**: Todo o gerenciamento de estados dinâmicos (ciclo de vida de Gigs, escaneamento de QR Code de check-in/out, relatórios financeiros e chats) foi migrado e reside integralmente nas **stores do Zustand** em `packages/shared/src/utils/` (`freelancerFlowState.ts` e `contractorState.ts`).
* **Context API**: É reservada exclusivamente para a árvore estática de autenticação (`AuthContext.tsx`).
