# Tasks: Conexão Real Front-End ↔ Backend .NET 8 com PostgreSQL (009-real-backend-integration)

**Spec**: [`spec.md`](./spec.md) | **Plan**: [`plan.md`](./plan.md)  
**Status**: Complete (All tasks validated and passing)

---

## Sequenciamento de Execução

- [x] **T-001**: Adicionar configuração de proxy reverso em `apps/web/vite.config.ts` encaminhando `/api` para `http://localhost:5000`.
- [x] **T-002**: Atualizar DTOs e `AuthController.Register` no backend para receber e persistir o `Venue` (endereço, bairro, coordenadas) quando for perfil `Contractor`.
- [x] **T-003**: Inicializar o backend ASP.NET Core em background na porta 5000 (`dotnet run --project apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.csproj --urls=http://localhost:5000`).
- [x] **T-004**: Conectar `apps/web/src/context/AuthContext.tsx` aos endpoints reais `POST /api/auth/login` e `POST /api/auth/register`, mantendo a sessão persistida em cache (`localStorage`) até o logout manual.
- [x] **T-005**: Atualizar `apps/web/src/screens/LoginScreen.tsx` para exibir feedback de erro em caso de credenciais incorretas e manter o preenchimento de teste com os usuários reais (`gabriel.silva@trampotaxa.com.br` / `gerencia@bistrobatel.com.br`).
- [x] **T-006**: Atualizar `apps/web/src/screens/CadastroScreen.tsx` com campos de endereço e bairro da loja para o contratante, validando e persistindo no PostgreSQL.
- [x] **T-007**: Integrar a plotagem de estabelecimentos no Google Maps (`MapDashboardScreen.tsx`) com os dados reais salvos no banco.
- [x] **T-008**: Conectar a criação de vagas em `apps/web/src/screens/contractor/CreateGigScreen.tsx` ao endpoint `POST /api/contractor/gigs`.
- [x] **T-009**: Conectar a listagem de vagas no radar e mapa do Freelancer ao endpoint `GET /api/gigs`.
- [x] **T-010**: Conectar o cliente mobile (`apps/mobile/src/api/client.ts`) para suporte unificado à API.
- [x] **T-011**: Executar testes xUnit no backend e compilação/lint do applet (`compile_applet` e `lint_applet`).
- [x] **T-012**: Higienização final e remoção de qualquer lixo ou código órfão.
