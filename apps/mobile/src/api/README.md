# 🌐 Mobile API Client (`apps/mobile/src/api`)

Este diretório provê a camada de comunicação HTTP autenticada para o aplicativo móvel nativo, com injeção automática de tokens JWT Bearer e integração com o ciclo de vida do React Native.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Função / Hook Exportado | Responsabilidade Central | Testes Associados |
| :--- | :--- | :--- | :--- |
| **`authenticatedFetch.ts`** | `authenticatedFetch` | Função pura de fetch que intercepta chamadas, lê o token do armazenamento de sessão e adiciona o cabeçalho `Authorization: Bearer <token>` | `authenticatedFetch.test.ts` |
| **`useAuthenticatedFetch.ts`** | `useAuthenticatedFetch` | Hook React que expõe o cliente autenticado integrado ao contexto de autenticação do app | N/A |

---

## 🏛️ Detalhamento dos Componentes

### 1. `authenticatedFetch.ts` — Interceptor HTTP Móvel
* Garante que toda requisição para o backend (`/api/gigs`, `/api/chat`, etc.) carregue credenciais válidas.
* Trata erros `401 Unauthorized` disparando a expiração segura da sessão e redirecionando para o login.

### 2. `useAuthenticatedFetch.ts` — Consumo em Componentes
* Facilita chamadas assíncronas em telas e hooks do React Native com memoização automática.
