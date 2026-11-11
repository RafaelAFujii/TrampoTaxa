# Feature Specification: Conexão Real Front-End ↔ Backend .NET 8 com PostgreSQL (009-real-backend-integration)

**Feature Branch**: `009-real-backend-integration`  
**Created**: 2026-11-11  
**Status**: Specified / Planned (Phase: Specify/Plan - Spec-Kit)  
**Input**: Conectar a aplicação Web (`apps/web`) e Mobile (`apps/mobile`) ao backend corporativo .NET 8 (`apps/server-dotnet`) e banco PostgreSQL 15, garantindo autenticação real (com falhas explícitas), isolamento de dados de demonstração, cadastro de endereço validado com geolocalização no Google Maps e sincronização bidirecional de vagas e candidaturas em tempo real.

---

## 1. Visão Geral & Objetivos de Engenharia

O **TrampoTaxa** já dispõe de um backend transacional construído em **ASP.NET Core (.NET 8)** com **PostgreSQL 15** e ORM **Entity Framework Core (Npgsql)**. No entanto, o front-end web e mobile vinha operando com dados mockados em `localStorage` e stores isoladas (modo playground).

Esta especificação define os contratos e regras para transformar o sistema em uma **aplicação corporativa real**:
1. **Autenticação Real com Falha Explícita**: O login consulta o PostgreSQL via hash BCrypt. Se o e-mail ou senha forem inválidos, retorna `HTTP 401 Unauthorized` e o front exibe `"Email ou senha incorretos."` bloqueando o acesso.
2. **Sessão Persistente em Cache (LocalStorage)**: A sessão do usuário permanece salva no cache/armazenamento local até que ele clique explicitamente em "Sair" (Logout) para alternar de conta.
3. **Cadastro do Endereço do Contratante com Geocodificação no Mapa**:
   - No cadastro e perfil do contratante, ele cadastra o endereço completo e o bairro da sua loja/estabelecimento (ex: Bares e Restaurantes em Curitiba).
   - O endereço é validado e geolocalizado com latitude/longitude e exibido com marcador dinâmico no Google Maps (com o fallback vetorial SVG resiliente caso a chave de API não esteja presente).
4. **Isolamento de Demonstração**: Os atalhos de teste utilizam credenciais reais persistidas no banco (`gabriel.silva@trampotaxa.com.br` e `gerencia@bistrobatel.com.br` com a senha `SenhaSegura123!`). Nenhum dado fictício é injetado se um novo usuário se cadastrar ou logar.
5. **Persistência de Cadastros Reais**: Novos usuários cadastrados via tela de cadastro são gravados na tabela `"Users"` (e respectivo `"Venues"` para Contratantes) do PostgreSQL e podem logar imediatamente.
6. **Sincronização de Vagas em Tempo Real**: Vagas criadas no painel do Contratante são persistidas na tabela `"Gigs"` vinculadas ao seu endereço real e refletem imediatamente no Radar e Mapa do Freelancer.

---

## 2. Requisitos Funcionais (RFs)

### RF-01: Roteamento Transparente de API (Vite Proxy)
- Configuração de proxy no `apps/web/vite.config.ts`: todas as requisições direcionadas para `/api/*` devem ser encaminhadas ao servidor backend Kestrel (`http://localhost:5000`).
- Sem portas fixas no código cliente; URLs relativas `/api/...`.

### RF-02: Autenticação Segura e Validação Estrita
- `POST /api/auth/login`:
  - Entrada: `{ email: string, password: string }`.
  - Sucesso (`200 OK`): Retorna token JWT, `userId`, `name`, `email`, `role`, `pixKey`, `specialty`, `venue` (para contratantes) e `rating`.
  - Falha (`401 Unauthorized`): Retorna `{ message: "Email ou senha incorretos." }`. O front-end DEVE exibir a mensagem em alerta visual e não permitir o acesso.
- `POST /api/auth/register`:
  - Entrada Contratante: `{ name, email, password, role: "Contractor", document (CNPJ), phone, venueName, address, neighborhood, city, state, latitude, longitude }`.
  - Entrada Freelancer: `{ name, email, password, role: "Freelancer", document (CPF), phone, pixKey, specialty }`.
  - Sucesso (`200 OK`): Insere no PostgreSQL com senha em hash BCrypt, gera o registro de `Venue` vinculado (para contratantes) e autentica gerando JWT.
  - Conflito (`400 Bad Request`): Se o e-mail já existir, retorna `{ message: "Email já cadastrado na plataforma." }`.

### RF-03: Cadastro e Validação de Endereço do Estabelecimento (Google Maps)
- O formulário de cadastro do Contratante inclui campos para: Nome do Estabelecimento, Bairro, Endereço e CEP/Cidade.
- O sistema valida o endereço, calcula/associa as coordenadas geográficas correspondentes e plota o estabelecimento com marcador interativo no Google Maps e no radar do freelancer.
- A vaga criada pelo contratante herda automaticamente o `venueId` e a localização real de sua loja.

### RF-04: Sincronização de Vagas (Contratante ↔ Freelancer)
- `POST /api/contractor/gigs`:
  - Contratante envia dados da vaga (`venueId`, `title`, `roleRequired`, `description`, `hourlyRate`, `estimatedTotal`, `shiftStart`, `shiftEnd`, `vacancies`).
  - Persiste no PostgreSQL com status `Open`.
- `GET /api/gigs`:
  - Freelancer lista vagas reais salvas no banco.
  - Vagas criadas pelo contratante aparecem imediatamente no radar do mapa no ponto exato da loja.

### RF-05: Candidatura e Regras dos Três Pilares
- `POST /api/freelancer/apply`: Valida o limite de até 3 candidaturas ativas simultâneas (Pilar 1).
- `POST /api/freelancer/checkin`: Exige o código mestre `QR_MESTRE_123` e status de aprovado (Pilar 2).
- `POST /api/freelancer/request-checkout`: Inicia janela de contestação de 2 horas (Pilar 3).

---

## 3. Critérios de Sucesso & Verificação
- Zero poluição de arquivos ou código morto.
- Sessão do usuário preservada no navegador até logout manual.
- Estabelecimento do contratante com endereço salvo e visível no mapa.
- Coexistência limpa com testes automatizados do backend (`dotnet test`) e do monorepo (`bun test` e `compile_applet`).
