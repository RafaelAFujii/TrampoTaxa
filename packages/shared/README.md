# ⚙️ TrampoTaxa Shared & Backend API Core

Pacote central de serviços compartilhados (`@trampotaxa/shared`), modelos de dados e clientes de API gerados a partir da especificação formal **OpenAPI 3.0 (RESTful)** do ecossistema TrampoTaxa.

---

## 🎯 Propósito e Responsabilidade

O `@trampotaxa/shared` é a **fonte única da verdade** (Single Source of Truth) para todo o monorepo, alimentando tanto a aplicação Web (`apps/web`) quanto o aplicativo Mobile (`apps/mobile`):

1. **Tipagens Canônicas (TypeScript):** Entidades do domínio gastronômico (`GigOffer`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`).
2. **Automação de API (Orval + React Query):** Geração automática de clientes HTTP e hooks tipados (`useQuery` / `useMutation`) a partir do contrato OpenAPI.
3. **Formatadores e Validadores Fiscais:** Algoritmo oficial de validação de CNPJ (Módulo 11 da Receita Federal), máscaras de telefone brasileiro e formatação monetária em Real (`R$ 0,00`).
4. **Mock Datasets de Domínio:** Dados geolocalizados de Curitiba/PR (`mockGigs` e `INITIAL_CONTRACTOR_GIGS`) com isolamento estrito contra poluição de bundles em produção.

---

## 📡 Matriz Completa de Endpoints da API RESTful (OpenAPI 3.0)

A especificação formal completa está documentada em [`apps/web/docs/openapi.yaml`](../../apps/web/docs/openapi.yaml) e [`docs/openapi.yaml`](../../docs/openapi.yaml).

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

O **Orval 8** lê a especificação OpenAPI e gera automaticamente clientes tipados em TypeScript e hooks do React Query:

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

Para atualizar os clientes após alterar o contrato:

```bash
bun run api:generate
```

---

## 🗄️ Modelagem de Dados & Arquitetura de Banco

Para detalhes completos de modelagem relacional, consulte [`apps/web/docs/DATABASE_MER.md`](../../apps/web/docs/DATABASE_MER.md):

* **Diagrama Entidade-Relacionamento (MER/DER):** Mapeamento de `USUARIOS`, `ESTABELECIMENTOS`, `FREELANCERS`, `TAXAS_VAGAS`, `CANDIDATURAS`, `AVALIACOES` e `MENSAGENS_CHAT`.
* **Código DBML:** Pronto para importação e visualização no [dbdiagram.io](https://dbdiagram.io/).

---

## 🧪 Testes Automatizados com Bun Test

```bash
# Executar a suíte de testes do pacote compartilhado
bun test
```
