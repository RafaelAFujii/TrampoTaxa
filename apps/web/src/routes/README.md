# 🚦 Routing & Security Gates (`apps/web/src/routes`)

Este diretório gerencia a árvore de rotas da aplicação Web e implementa a barreira de segurança por papéis (Role-Based Access Control - RBAC).

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Componente / Exportação | Responsabilidade Central | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`ProtectedRoute.tsx`** | `ProtectedRoute` | Guarda de segurança que intercepta navegação não autenticada ou sem perfil adequado | `role-navigation.test.ts` |
| **`routes.tsx`** | `AppRoutes` | Configuração declarativa de todas as rotas do React Router | `role-navigation.test.ts` |

---

## 🏛️ Detalhamento dos Componentes

### 1. `ProtectedRoute.tsx` — Barreira Fail-Closed
* **Verificação de Sessão:** Se o usuário não possui token válido, é redirecionado imediatamente para `/login`.
* **Verificação de Papel (`allowedRole`):**
  * Se uma rota for exclusiva de `Contratante` (ex: `/contractor/gigs`) e um `Freelancer` tentar acessá-la, ele é redirecionado com segurança para o radar de vagas (`/`).
  * Se uma rota for exclusiva de `Freelancer` (ex: `/active-gig`) e um `Contratante` tentar acessá-la, ele é redirecionado para `/contractor/gigs`.

### 2. `routes.tsx` — Árvore de Navegação
* **Rotas Públicas:** `/login`, `/cadastro`.
* **Rotas do Freelancer:**
  * `/` ou `/map`: Radar de vagas em tempo real em Curitiba.
  * `/active-gig`: Acompanhamento e check-in do turno ativo.
  * `/earnings`: Extrato financeiro com repasses PIX.
  * `/profile`: Perfil do profissional e configurações.
* **Rotas do Contratante:**
  * `/contractor/gigs`: Painel de vagas publicadas e triagem.
  * `/contractor/create`: Formulário de criação de vagas.
  * `/contractor/reports`: Relatórios de investimento e horas.
  * `/contractor/chat`: Chat operacional com freelancers.
