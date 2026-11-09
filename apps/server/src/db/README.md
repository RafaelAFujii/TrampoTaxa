# 🗄️ Database Layer (`apps/server/src/db`)

Este módulo gerencia a camada de persistência de dados do backend TrampoTaxa, fornecendo schemas relacionais, pool de conexões com Microsoft SQL Server (MSSQL), fallback gracioso em memória e script de seed com dados reais de estabelecimentos e vagas em Curitiba/PR.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Propósito Técnico | Principais Exportações | Dependências Chave |
| :--- | :--- | :--- | :--- |
| **`client.ts`** | Pool de conexões MSSQL e repositório resiliente de banco de dados | `db`, `getDbConnection()`, `mssqlConfig`, `inMemoryDb` | `mssql`, `./schema` |
| **`schema.ts`** | Definição de tabelas relacionais Drizzle e interfaces de entidade TypeScript | `users`, `venues`, `gigs`, `gigApplicants`, `chatMessages`, `reviews`, `UserEntity`, `GigEntity`... | `drizzle-orm/sqlserver-core`, `drizzle-orm` |
| **`seed.ts`** | Script de carga inicial de estabelecimentos de Curitiba (Batel, Itupava, etc.) e vagas | `seedDatabase()`, `main` | `./client`, `./schema` |

---

## 🏛️ Detalhamento dos Componentes

### 1. `client.ts` — Resiliência e Operações Transacionais
* **Pool MSSQL:** Conecta ao banco Microsoft SQL Server na porta `1433` com timeout seguro e suporte a criptografia configurável.
* **Fallback Gracioso (`inMemoryDb`):** Se o servidor MSSQL não estiver ativo (ex: em ambientes de CI ou durante testes rápidos locais), o cliente chaveia automaticamente para um repositório em memória `Map<string, Entity>`, permitindo que a aplicação execute com 100% de funcionalidade sem quebras.
* **Operações Disponíveis:**
  * Usuários: `findUserByEmail`, `findUserById`, `upsertUser`
  * Locais: `upsertVenue`, `listVenues`
  * Vagas: `listGigs`, `findGigById`, `upsertGig`
  * Candidaturas: `findApplicantsByGigId`, `countActiveApplicationsForFreelancer`, `upsertApplicant`, `cancelConcurrentApplicationsForFreelancer`
  * Chat & Avaliações: `listMessagesByGigId`, `insertChatMessage`, `insertReview`

### 2. `schema.ts` — Modelagem Relacional Estrita
* **Tabelas Drizzle:**
  * `users`: Usuários com suporte a perfis `freelancer` e `contractor`, credenciais com hash, reputação, chaves PIX e métricas.
  * `venues`: Bares e restaurantes com coordenadas geoespaciais (`lat`, `lng`), bairro e endereço em Curitiba.
  * `gigs`: Vagas pontuais com data, horário de início/término, valor monetário, traje exigido, código secreto de Master QR Code e prazos de auto check-out.
  * `gig_applicants`: Candidaturas com controle estrito de overbooking e estados de aprovação.
  * `chat_messages`: Mensageria contextual atrelada ao turno.
  * `reviews`: Avaliações bilaterais com notas de 1 a 5 estrelas e tags de feedback.

### 3. `seed.ts` — Inicialização de Dados
* Popula o banco com estabelecimentos de referência em Curitiba (ex: *Taj Bar Batel*, *Pizzaria Babilônia Cabral*, *Whad Cocktails Itupava*), contas de teste e oportunidades para bartenders e garçons.
* Pode ser executado a qualquer momento com:
  ```bash
  bun --filter @trampotaxa/server seed
  ```
