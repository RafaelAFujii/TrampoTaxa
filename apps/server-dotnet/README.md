# ⚙️ apps/server-dotnet — TrampoTaxa .NET 8 Backend API

API de backend corporativa do ecossistema **TrampoTaxa (Loctaxa CWB)** desenvolvida em **ASP.NET Core (.NET 8)** com **PostgreSQL 15** e **Entity Framework Core (Npgsql)**.

---

## 🛠️ Stack Tecnológica Backend .NET

* **Plataforma:** [.NET 8 LTS (ASP.NET Core Web API)](https://dotnet.microsoft.com/)
* **Banco de Dados:** [PostgreSQL 15](https://www.postgresql.org/) rodando localmente
* **ORM:** [Entity Framework Core 8 (Npgsql.EntityFrameworkCore.PostgreSQL)](https://www.npgsql.org/efcore/)
* **Autenticação:** JWT nativo com assinatura `HMAC-SHA256` (`Microsoft.AspNetCore.Authentication.JwtBearer`)
* **Criptografia de Senhas:** `BCrypt.Net-Next` (Blowfish salting nativo)
* **Documentação de API:** Swagger / OpenAPI (`Swashbuckle.AspNetCore`)
* **Testes Automatizados:** [xUnit](https://xunit.net/) com `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory`)

---

## 📁 Estrutura de Diretórios

```
apps/server-dotnet/
├── TrampoTaxa.sln                   # Solução .NET
├── src/
│   └── TrampoTaxa.Api/              # Projeto da Web API
│       ├── Controllers/             # Controladores RESTful
│       │   ├── AuthController.cs    # Registro, Login e Perfil do Usuário
│       │   ├── GigsController.cs    # Catálogo e busca geoespacial de vagas
│       │   ├── FreelancerController.cs # Overbooking, QR Mestre e Auto-Checkout
│       │   ├── ContractorController.cs # Aprovação atômica, avaliação e dashboard B2B
│       │   └── ChatController.cs    # Mensagens operacionais por vaga
│       ├── Data/
│       │   ├── AppDbContext.cs      # DbContext do EF Core com mapeamento relacional
│       │   └── DbInitializer.cs     # Seed de estabelecimentos e usuários reais no PostgreSQL
│       ├── DTOs/
│       │   └── Dtos.cs              # Records e contratos de entrada/saída tipados
│       │
│       ├── Models/
│       │   └── Entities.cs          # Entidades canônicas (User, Venue, Gig, Application, Shift, Chat)
│       ├── Services/
│       │   └── TokenService.cs      # Geração e validação de tokens JWT
│       ├── appsettings.json         # String de conexão do PostgreSQL e segredo JWT
│       ├── Program.cs               # Configuração do pipeline HTTP e inicialização
│       └── TrampoTaxa.Api.csproj    # Dependências de pacotes NuGet
│
└── tests/
    └── TrampoTaxa.Api.Tests/        # Projeto de testes automatizados
        ├── IntegrationTests.cs      # Testes ponta a ponta dos 3 Pilares e Autenticação
        └── TrampoTaxa.Api.Tests.csproj # Referências xUnit e WebApplicationFactory
```

---

## 🏛️ Os 3 Pilares TrampoTaxa Implementados

1. **Pilar 1: Controle Estrito de Overbooking (`FreelancerController.Apply`)**
   - Limite máximo de **3 candidaturas ativas simultâneas** por freelancer.
   - A 4ª tentativa de candidatura retorna imediatamente `HTTP 400 Bad Request`.
2. **Pilar 2: Check-in Obrigatório por QR Code Mestre Físico (`FreelancerController.CheckIn`)**
   - Valida a presença física no estabelecimento exigindo o segredo `QR_MESTRE_123`.
   - Bloqueia check-ins sem candidatura aprovada formalmente pelo contratante.
3. **Pilar 3: Auto-Checkout com Janela de Contestação (`FreelancerController.RequestCheckout`)**
   - Ao solicitar checkout, abre automaticamente a janela de contestação de **2 horas** para o contratante.
   - O contratante pode aprovar imediatamente (`/api/contractor/approve-shift`), contestar (`/api/contractor/contest-shift`) ou aguardar a liberação do PIX.

---

## 👥 Usuários de Teste Reais no PostgreSQL

Ao iniciar a API, o `DbInitializer.Seed` provisiona usuários reais com senhas criptografadas em hash BCrypt (`SenhaSegura123!`):

| Papel | Nome | E-mail | Senha | Detalhes / Chave Pix |
| :--- | :--- | :--- | :--- | :--- |
| **Contratante** | Gerência Bistrô do Batel | `gerencia@bistrobatel.com.br` | `SenhaSegura123!` | CNPJ: `12.345.678/0001-90` (Batel, Curitiba) |
| **Freelancer** | Gabriel Silva | `gabriel.silva@trampotaxa.com.br` | `SenhaSegura123!` | Bartender (Pix: `gabriel.silva@pix.trampotaxa.com.br`) |
| **Freelancer** | Mariana Souza | `mariana.souza@trampotaxa.com.br` | `SenhaSegura123!` | Hostess (Pix: `mariana.souza@pix.trampotaxa.com.br`) |
| **Freelancer** | Lucas Oliveira | `lucas.oliveira@trampotaxa.com.br` | `SenhaSegura123!` | Garçom (Pix: `lucas.oliveira@pix.trampotaxa.com.br`) |

---

## 💻 Comandos de Execução (.NET CLI)

A partir da raiz do monorepo:

```bash
# 1. Compilar a solução inteira
dotnet build apps/server-dotnet/TrampoTaxa.sln

# 2. Executar os testes de integração automatizados (xUnit)
dotnet test apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj

# 3. Executar o servidor backend (porta 5000 / Swagger em /swagger)
dotnet run --project apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.csproj
```

---

## 🗄️ Conexão com o PostgreSQL

String de conexão configurada em `appsettings.json`:
```
Host=localhost;Database=trampotaxa_db;Username=trampotaxa_user;Password=TrampoTaxa2026!
```

Para verificar via terminal psql:
```bash
PGPASSWORD='TrampoTaxa2026!' psql -h localhost -U trampotaxa_user -d trampotaxa_db -c "SELECT \"Id\", \"Name\", \"Email\", \"Role\" FROM \"Users\";"
```
