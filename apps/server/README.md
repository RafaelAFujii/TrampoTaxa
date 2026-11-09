# ⚙️ @trampotaxa/server — Backend Server (Fastify + tRPC v11 + Drizzle ORM)

O workspace **`@trampotaxa/server`** provê o núcleo transacional, persistência de dados em SQL Server / MSSQL e contratos fortemente tipados de ponta a ponta através do [tRPC v11](https://trpc.io/) e [Drizzle ORM](https://orm.drizzle.team/).

---

## 🏛️ Arquitetura e Decisões Técnicas

* **Runtime:** Bun / Node.js
* **Protocolo de Comunicação:** tRPC v11 com transporte HTTP e validação estrita via [Zod](https://zod.dev/).
* **Camada de Dados (ORM):** Drizzle ORM com suporte a dialeto SQL Server / MSSQL (`drizzle-orm/sqlserver-core` e `mssql`).
* **Segurança e Autenticação:** JWT Bearer tokens com RBAC no middleware de contexto (`freelancer` e `contractor`).
* **Integração no Monorepo:** O pacote exporta a tipagem do `AppRouter` para consumo direto pelo cliente frontend, garantindo autocompletion total de chamadas de API sem necessidade de sincronização manual.

---

## 📁 Estrutura de Diretórios e Submódulos

```
apps/server/
├── src/
│   ├── db/                 # Conexão Drizzle, Schemas e Seed de Dados
│   │   ├── client.ts       # Pool de conexões MSSQL e inicialização do db
│   │   ├── schema.ts       # Definição relacional das tabelas e chaves estrangeiras
│   │   ├── seed.ts         # População inicial com bares e vagas de Curitiba
│   │   └── README.md       # Documentação detalhada da camada de banco
│   │
│   ├── routers/            # Controladores tRPC divididos por domínio
│   │   ├── index.ts        # AppRouter unificado
│   │   ├── auth.ts         # Login e registro de usuários com RBAC
│   │   ├── gigs.ts         # Criação, listagem e busca geoespacial de vagas
│   │   ├── chat.ts         # Mensagens operacionais entre gestor e freelancer
│   │   ├── contractor.ts   # Métricas financeiras e gestão de estabelecimentos
│   │   ├── freelancer.ts   # Candidaturas e extrato de turnos do profissional
│   │   └── README.md       # Documentação detalhada dos routers
│   │
│   ├── trpc/               # Configuração e middlewares do tRPC
│   │   ├── init.ts         # Fábrica de tRPC e procedures protegidas
│   │   ├── context.ts      # Extração de cabeçalhos e decodificação JWT
│   │   └── README.md       # Documentação detalhada do ciclo tRPC
│   │
│   ├── __tests__/          # Suíte de testes unitários e de integração
│   │   └── server.test.ts  # Testes de inicialização e rotas
│   │
│   └── index.ts            # Ponto de entrada e listener HTTP do servidor
│
├── package.json            # Scripts de execução e dependências
└── tsconfig.json           # Configuração de TypeScript para o backend
```

---

## 🚀 Comandos de Desenvolvimento

A partir da raiz do monorepo:

```bash
# Iniciar o servidor em modo de desenvolvimento (watch mode)
bun --filter @trampotaxa/server dev

# Executar o seed inicial do banco de dados (estabelecimentos e vagas em Curitiba)
bun --filter @trampotaxa/server seed

# Executar os testes automatizados do servidor
bun --filter @trampotaxa/server test
```

Ou diretamente na pasta `apps/server`:

```bash
cd apps/server
bun run dev
bun run seed
bun run test
```

---

## ⚙️ Variáveis de Ambiente (`.env`)

Crie o arquivo `apps/server/.env` com as seguintes chaves:

```env
PORT=3001
DATABASE_URL=sqlserver://localhost:1433;database=trampotaxa;user=sa;password=YourStrongPassword!;encrypt=false
JWT_SECRET=sua_chave_secreta_jwt_de_desenvolvimento
```

---

## 🔗 Navegação Modular

* Para entender a camada de banco de dados: [src/db/README.md](./src/db/README.md)
* Para entender as rotas e regras de negócio: [src/routers/README.md](./src/routers/README.md)
* Para entender a infraestrutura e segurança tRPC: [src/trpc/README.md](./src/trpc/README.md)
