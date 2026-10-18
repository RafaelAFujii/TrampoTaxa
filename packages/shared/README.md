# ⚙️ TrampoTaxa Shared & Backend API Core

Pacote central de serviços compartilhados (`@trampotaxa/shared`), modelos de dados e clientes de API gerados a partir da especificação formal **OpenAPI 3.0 (RESTful)** do ecossistema TrampoTaxa.

---

## 🎯 Propósito e Responsabilidade

O `@trampotaxa/shared` atua como a **fonte única da verdade** (Single Source of Truth) para todo o monorepo, alimentando tanto a aplicação Web (`apps/web`) quanto o aplicativo Mobile (`apps/mobile`):

1. **Tipagens Canônicas (TypeScript):** Entidades do domínio gastronômico (`GigOffer`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`).
2. **Automação de API (Orval + React Query):** Geração automática de clientes HTTP nativos e hooks assíncronos (`useQuery` / `useMutation`) a partir do `openapi.yaml`.
3. **Formatadores e Validadores Fiscais:** Algoritmo oficial de validação de CNPJ (Módulo 11 da Receita Federal), máscaras de telefone brasileiro e formatação monetária em Real (`R$ 0,00`).
4. **Mock Datasets e Domínio:** Dados geolocalizados de Curitiba/PR (`mockGigs` e `INITIAL_CONTRACTOR_GIGS`) com isolamento estrito contra poluição de bundles em produção.

---

## 📡 Especificação da API RESTful (OpenAPI 3.0)

A especificação formal completa está documentada em [`apps/web/docs/openapi.yaml`](../../apps/web/docs/openapi.yaml) e [`docs/openapi.yaml`](../../docs/openapi.yaml).

### Principais Grupos de Endpoints

| Tag / Módulo | Métodos | Endpoints | Descrição |
| :--- | :---: | :--- | :--- |
| **Autenticação & Usuários** | `POST` / `GET` | `/auth/login`, `/auth/register`, `/auth/me` | Login RBAC, primeiro acesso e perfil autenticado com Bearer JWT |
| **Taxas & Vagas (Gigs)** | `GET` / `POST` | `/gigs`, `/gigs/{id}` | Radar geolocalizado, filtros por raio (km) e criação de turnos |
| **Candidaturas & Seleção** | `POST` / `GET` | `/gigs/{id}/apply`, `/gigs/{id}/applicants` | Candidatura de freelancers e triagem pelo contratante |
| **Decisão de Vagas** | `POST` | `/gigs/{id}/applicants/{id}/approve`, `/reject` | Aprovação/recusa com atualização atômica de status |
| **Avaliações & Desempenho** | `POST` | `/gigs/{id}/evaluation` | Avaliação pós-turno por estrelas e tags de performance |
| **Chat & Operação** | `GET` / `POST` | `/chat/{gigId}/messages` | Mensageria direta para alinhamento de portaria e vestimenta |
| **Relatórios & Financeiro** | `GET` | `/contractor/reports` | KPIs de investimento, média horária gasta e repasses PIX |

---

## 🤖 Pipeline de Geração de Código com Orval

Utilizamos o **Orval 8** para ler a especificação OpenAPI e gerar clientes nativos e hooks do React Query:

```
                  ┌────────────────────────┐
                  │ apps/web/docs/         │
                  │     openapi.yaml       │
                  └───────────┬────────────┘
                              │
                      [ bun run api:generate ]
                      [ orval.config.ts      ]
                              │
                              ▼
                  ┌────────────────────────┐
                  │ packages/shared/       │
                  │   ├── src/api/model/   │  (Tipos dos Schemas)
                  │   └── src/api/endpoints│ (useQuery & useMutation)
                  └────────────────────────┘
```

### Como Executar a Geração (Bun)
A partir da raiz do monorepo:
```bash
bun run api:generate
```

---

## 🗄️ Modelagem de Dados & Arquitetura de Banco

Para detalhes completos de modelagem relacional, consulte [`apps/web/docs/DATABASE_MER.md`](../../apps/web/docs/DATABASE_MER.md):

* **Diagrama Entidade-Relacionamento (MER/DER):** Mapeamento de `USUARIOS`, `ESTABELECIMENTOS`, `FREELANCERS`, `TAXAS_VAGAS`, `CANDIDATURAS`, `AVALIACOES` e `MENSAGENS_CHAT`.
* **Código DBML:** Pronto para importação e visualização no [dbdiagram.io](https://dbdiagram.io/).

---

## 🧪 Testes Automatizados da Camada de Domínio

O pacote possui cobertura completa com o **Bun Test**:

- `formatters.test.ts`: Validação matemática de CNPJs válidos e inválidos, tratamento de caracteres não numéricos e formatação monetária.
- `gigs.test.ts` & `gig_consultation.test.ts`: Filtros de profissão, ordenação de taxas por valor e validação de atributos obrigatórios.
- `api-generation.test.ts`: Validação de tags OpenAPI e consistência dos clientes gerados.
- `mocks.test.ts`: Garantia de isolamento dos fixtures de teste fora do bundle de produção.

```bash
bun test
```
