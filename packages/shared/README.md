# ⚙️ @trampotaxa/shared — Contratos, Tipagens e API Core

Pacote central de serviços compartilhados (`@trampotaxa/shared`), modelos de dados e clientes de API gerados a partir da especificação formal **OpenAPI 3.0 (RESTful)** do ecossistema TrampoTaxa.

---

## 🎯 Propósito e Responsabilidade

O `@trampotaxa/shared` é a **fonte única da verdade** (Single Source of Truth) para todo o monorepo, alimentando a aplicação Web (`apps/web`), o aplicativo Mobile (`apps/mobile`) e servindo de referência de domínio para o backend (`apps/server`):

1. **Tipagens Canônicas (TypeScript):** Entidades do domínio gastronômico (`Gig`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`).
2. **Automação de API (Orval + React Query):** Geração automática de clientes HTTP e hooks tipados (`useQuery` / `useMutation`) a partir do contrato OpenAPI.
3. **Formatadores e Validadores Fiscais:** Algoritmo oficial de validação de CNPJ (Módulo 11 da Receita Federal), máscaras de telefone brasileiro e formatação monetária em Real (`R$ 0,00`).
4. **Mock Datasets de Domínio:** Dados geolocalizados de Curitiba/PR (`mockGigs` e `INITIAL_CONTRACTOR_GIGS`) com isolamento estrito contra poluição de bundles em produção.

---

## 📁 Estrutura de Diretórios e Submódulos

```
packages/shared/
├── src/
│   ├── api/                    # Clientes de API e modelos tipados gerados pelo Orval
│   │   ├── endpoints/          # Hooks do React Query agrupados por tag da API
│   │   ├── model/              # Schemas e interfaces TypeScript da API
│   │   ├── index.ts            # Exportação unificada da camada de API
│   │   └── README.md           # Documentação detalhada da geração de API
│   │
│   ├── data/                   # Datasets canônicos e mocks de Curitiba
│   │   ├── mockGigs.ts         # Lista de vagas de Curitiba com geolocalização real
│   │   ├── mockContractorData.ts # Dados de estabelecimentos e candidatos
│   │   └── README.md           # Documentação detalhada dos datasets
│   │
│   ├── types/                  # Entidades centrais do domínio
│   │   ├── contractor.ts       # Modelos para contratantes e relatórios B2B
│   │   ├── freelancerFlow.ts   # Estados e transições da jornada do freelancer
│   │   ├── index.ts            # Re-export de todos os tipos canônicos
│   │   └── README.md           # Documentação detalhada dos tipos
│   │
│   ├── utils/                  # Utilitários fiscais, matemáticos e de formatação
│   │   ├── formatters.ts       # Formatação monetária BRL, CNPJ, telefone e data
│   │   ├── freelancerFlowState.ts # Transições seguras de turno
│   │   ├── gigs.ts             # Cálculos geoespaciais e filtros
│   │   └── README.md           # Documentação detalhada dos utilitários
│   │
│   ├── index.ts                # Ponto de entrada do pacote `@trampotaxa/shared`
│   └── mocks.ts                # Helpers para isolamento de dados de teste
│
├── openapi.yaml                # Especificação formal da API RESTful (OpenAPI 3.0)
├── orval.config.ts             # Configuração do gerador Orval
├── package.json                # Dependências e scripts do pacote
└── tsconfig.json               # Configuração TypeScript estrita
```

---

## 📡 Matriz de Endpoints da API RESTful (OpenAPI 3.0)

A especificação formal completa está documentada em [`openapi.yaml`](./openapi.yaml):

| Módulo / Tag | Método | Rota | Descrição do Fluxo | Autenticação |
| :--- | :---: | :--- | :--- | :---: |
| **Autenticação** | `POST` | `/auth/login` | Login com e-mail/senha, retornando JWT e papel do usuário | Pública |
| **Autenticação** | `POST` | `/auth/register` | Cadastro com validação de CNPJ ou CPF e papel inicial | Pública |
| **Autenticação** | `GET` | `/auth/me` | Retorna o perfil completo do usuário da sessão atual | Bearer JWT |
| **Vagas & Radar** | `GET` | `/gigs` | Listagem geolocalizada de vagas com filtros de raio e cargo | Pública |
| **Vagas & Radar** | `GET` | `/gigs/{id}` | Detalhes da vaga, briefing de apresentação e dress code | Pública |
| **Vagas & Radar** | `POST` | `/gigs` | Criação de nova vaga de taxa por um contratante | Bearer JWT (B2B) |
| **Candidaturas** | `POST` | `/gigs/{id}/apply` | Candidatura de um freelancer a uma vaga em aberto | Bearer JWT |
| **Candidaturas** | `GET` | `/gigs/{id}/applicants`| Lista de candidatos inscritos para avaliação do contratante | Bearer JWT (B2B) |
| **Decisão de Vagas**| `POST` | `/gigs/{id}/applicants/{id}/approve` | Aprovação do candidato e fechamento da vaga | Bearer JWT (B2B) |
| **Decisão de Vagas**| `POST` | `/gigs/{id}/applicants/{id}/reject` | Recusa do candidato com feedback discreto | Bearer JWT (B2B) |
| **Avaliação** | `POST` | `/gigs/{id}/evaluation` | Avaliação pós-evento com nota de 1 a 5 estrelas | Bearer JWT |
| **Chat Operacional**| `GET` | `/chat/{gigId}/messages` | Histórico de mensagens alinhando portaria e vestimenta | Bearer JWT |
| **Chat Operacional**| `POST` | `/chat/{gigId}/messages` | Envio de nova mensagem em tempo real | Bearer JWT |
| **Relatórios B2B** | `GET` | `/contractor/reports` | Métricas financeiras, total investido e média horária | Bearer JWT (B2B) |

---

## 🤖 Pipeline de Geração de Código com Orval

Para atualizar os clientes tipados a partir de modificações em `openapi.yaml`:

```bash
# Na raiz do monorepo:
bun run api:generate
```

---

## 🔗 Navegação Modular

* Camada de API gerada: [src/api/README.md](./src/api/README.md)
* Datasets mock de Curitiba: [src/data/README.md](./src/data/README.md)
* Tipagens e modelos canônicos: [src/types/README.md](./src/types/README.md)
* Formatadores e validadores fiscais: [src/utils/README.md](./src/utils/README.md)
