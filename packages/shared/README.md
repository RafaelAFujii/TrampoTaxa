# ⚙️ TrampoTaxa Shared & Backend API Core

Pacote central de serviços compartilhados (`@trampotaxa/shared`), modelos de dados e clientes de API gerados a partir da especificação formal **OpenAPI 3.0 (RESTful)** do ecossistema TrampoTaxa.

---

## 🎯 Propósito e Responsabilidade

O `@trampotaxa/shared` atua como a **única fonte da verdade** (Single Source of Truth) para todo o monorepo, alimentando tanto a aplicação Web (`apps/web`) quanto o aplicativo Mobile (`apps/mobile`):

1. **Tipagens Canônicas (TypeScript):** Entidades do domínio gastronômico (`GigOffer`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`).
2. **Automação de API (Orval + React Query):** Geração automática de clientes HTTP e hooks assíncronos (`useQuery` / `useMutation`) a partir do `openapi.yaml`.
3. **Formatadores e Validadores Fiscais:** Algoritmo oficial de validação de CNPJ (Módulo 11 da Receita Federal), máscaras de telefone brasileiro e formatação monetária em Real (`R$ 0,00`).
4. **Mock Datasets e Domínio:** Dados iniciais geolocalizados de Curitiba/PR (`mockGigs` e `INITIAL_CONTRACTOR_GIGS`) para testes locais e desenvolvimento desacoplado.

---

## 📡 Especificação da API RESTful (OpenAPI 3.0)

A especificação formal completa está documentada em [`apps/web/docs/openapi.yaml`](../../apps/web/docs/openapi.yaml).

### Principais Grupos de Endpoints

| Tag / Módulo | Métodos | Endpoints | Descrição |
| :--- | :---: | :--- | :--- |
| **Autenticação & Usuários** | `POST` / `GET` | `/auth/login`, `/auth/register`, `/auth/me` | Login RBAC, primeiro acesso e perfil autenticado |
| **Taxas & Vagas (Gigs)** | `GET` / `POST` | `/gigs`, `/gigs/{id}` | Radar geolocalizado, filtros de raio (km) e criação de turnos |
| **Candidaturas & Seleção** | `POST` / `GET` | `/gigs/{id}/apply`, `/gigs/{id}/applicants` | Candidatura de freelancers e triagem pelo contratante |
| **Decisão de Vagas** | `POST` | `/gigs/{id}/applicants/{id}/approve`, `/reject` | Aprovação/recusa com atualização de status |
| **Avaliações & Desempenho** | `POST` | `/gigs/{id}/evaluation` | Avaliação pós-turno por estrelas e tags de performance |
| **Chat & Operação** | `GET` / `POST` | `/chat/{gigId}/messages` | Mensageria direta para alinhamento de portaria e trajes |
| **Relatórios & Financeiro** | `GET` | `/contractor/reports` | KPIs de investimento, média horária e repasses PIX |

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

### Como Executar a Geração
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

O pacote possui cobertura de testes unitários com o **Vitest / Bun Test**:

- `formatters.test.ts`: Validação matemática de CNPJs válidos e inválidos, tratamento de caracteres não numéricos e formatação monetária.
- `gigs.test.ts` & `gig_consultation.test.ts`: Filtros de profissão, ordenação de taxas por valor e validação de atributos obrigatórios.
- `auth_flow.test.ts`: Verificação dos payloads cadastrais de acordo com os papéis do sistema.
- `contractor.test.ts`: Transições de status de turnos e contagem de candidatos.

```bash
bun test
```
