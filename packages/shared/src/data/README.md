# 📦 Shared Domain Datasets (`packages/shared/src/data`)

Este diretório fornece dados estruturados de referência, listas de vagas geolocalizadas e estabelecimentos reais em Curitiba/PR para testes, desenvolvimento offline e prototipação em alta fidelidade.

---

## 📋 Arquivos e Módulos do Diretório

| Arquivo | Finalidade Técnica | Entidades e Constantes Principais |
| :--- | :--- | :--- |
| **`mockGigs.ts`** | Vagas gastronômicas reais em Curitiba/PR com coordenadas exatas | `mockGigs`, vagas para *Bartender*, *Garçom*, *Cozinheiro* em bairros como Batel, Centro Cívico, Itupava |
| **`mockContractorData.ts`** | Dados cadastrais de estabelecimentos e candidatos | `INITIAL_CONTRACTOR_GIGS`, `MOCK_CANDIDATES`, relatórios financeiros |

---

## 🏛️ Detalhamento dos Datasets

### 1. `mockGigs.ts` — Vagas de Curitiba
* Contém registros completos com coordenadas geográficas precisas (`lat`, `lng`) para plotagem no mapa do radar.
* Cada vaga detalha:
  * Nome do estabelecimento e bairro (ex: *Taj Bar - Batel*, *Whad Cocktails - Alto da XV*).
  * Remuneração do turno formatada (`R$ 220,00`).
  * Horários de entrada e saída (ex: `18:00 - 02:00`).
  * Requisitos de vestimenta (dress code) e pontualidade.
  * Código secreto para validação do Master QR Code.

### 2. `mockContractorData.ts` — Painel do Estabelecimento
* Estrutura dados para a interface B2B do contratante:
  * Vagas ativas divididas por status (*Abertas*, *Aguardando Confirmação*, *Preenchidas*).
  * Perfil dos candidatos inscritos (foto de avatar, estrelas de avaliação, pontualidade percentual e total de turnos realizados).
  * Relatórios simulados de gastos com freelancer e horas operacionais por período (Semana, Mês, Ano).

### 3. Isolamento de Produção
* Todos os dados neste diretório são isolados e não devem vazar para bundles de produção finais, sendo validados por testes de política (`check-production-mocks.test.ts`).
