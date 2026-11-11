# Implementation Plan: Conexão Real Front-End ↔ Backend .NET 8 com PostgreSQL (009-real-backend-integration)

**Branch**: `009-real-backend-integration`  
**Phase**: Plan (Spec-Kit)  
**Parent Spec**: [`spec.md`](./spec.md)

---

## 1. Arquitetura da Solução

O monorepo utiliza o servidor ASP.NET Core (`apps/server-dotnet`) como motor transacional apoiado no PostgreSQL 15 local. O cliente Web (`apps/web`) se comunicará com o backend por chamadas HTTP relativas (`/api/...`) roteadas pelo proxy do Vite em desenvolvimento.

```
+------------------------------------------------------------------------+
|                          CLIENTES DE INTERFACE                         |
|  apps/web (Vite + React 19)          apps/mobile (React Native / Expo) |
+------------------------------------------------------------------------+
                   |                                     |
                   | (fetch /api/...)                    | (Bearer JWT)
                   v                                     v
+------------------------------------------------------------------------+
|                      VITE REVERSE PROXY (:3000)                        |
|                      Redireciona /api -> :5000                         |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|                     ASP.NET Core Web API (:5000)                       |
|   AuthController | GigsController | FreelancerCtrl | ContractorCtrl    |
|   JWT HMAC-SHA256 TokenService    | BCrypt Password Hasher             |
+------------------------------------------------------------------------+
                                   |
                                   v (EF Core 8 / Npgsql)
+------------------------------------------------------------------------+
|                           PostgreSQL 15                                |
|   Users (Hashed) | Venues (Endereço) | Gigs | Shifts | Chat            |
+------------------------------------------------------------------------+
```

---

## 2. Divisão de Tarefas por Fases

### Fase 1: Proxy e Roteamento de API no Vite
- [ ] Configurar proxy em `apps/web/vite.config.ts` apontando `/api` para `http://localhost:5000`.
- [ ] Configurar script e inicialização em segundo plano da API .NET no porto 5000.

### Fase 2: Autenticação Real, Sessão Persistente e Cadastro com Endereço
- [ ] Atualizar `RegisterRequest` no backend para incluir dados do estabelecimento (`venueName`, `address`, `neighborhood`, `city`, `latitude`, `longitude`).
- [ ] Atualizar `apps/web/src/context/AuthContext.tsx`:
  - Implementar chamada HTTP real `POST /api/auth/login`.
  - Tratamento de erro 401 com mensagem descritiva (não autenticar).
  - Implementar chamada HTTP real `POST /api/auth/register` gravando novos usuários e seu respectivo `Venue` no PostgreSQL.
  - Armazenar JWT e perfil no `localStorage` garantindo persistência contínua até o clique em Logout.
- [ ] Atualizar `apps/web/src/screens/LoginScreen.tsx` e `CadastroScreen.tsx`:
  - Inclusão dos campos de endereço e bairro do estabelecimento para contratantes.
  - Exibição de feedback amigável de erro caso o login falhe.
  - Preenchimento rápido dos dados de teste reais (`gabriel.silva@trampotaxa.com.br` e `gerencia@bistrobatel.com.br`).

### Fase 3: Validação de Endereço e Plotagem no Google Maps
- [ ] Validar e geolocalizar o endereço no cadastro e exibição do estabelecimento.
- [ ] Plotar marcador no mapa (`MapDashboardScreen.tsx`) com o nome, bairro e taxa cadastrados pelo contratante.

### Fase 4: Sincronização Real de Vagas entre Contratante e Freelancer
- [ ] Atualizar `CreateGigScreen.tsx` para enviar a nova vaga ao endpoint `POST /api/contractor/gigs` associada ao `venueId` real.
- [ ] Atualizar `useFreelancerFlowStore` e `MapDashboardScreen.tsx` para listar as vagas da tabela `"Gigs"` via `GET /api/gigs`.
- [ ] Integrar fluxo de candidatura com `POST /api/freelancer/apply` e check-in presencial com `POST /api/freelancer/checkin`.

### Fase 5: Validação, Testes e Higienização
- [ ] Executar suíte de testes xUnit (`dotnet test`).
- [ ] Executar compilação e validação do monorepo (`compile_applet` e `lint_applet`).
- [ ] Eliminar qualquer arquivo órfão ou inconsistente.
