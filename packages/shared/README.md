# ⚙️ @trampotaxa/shared — Contratos, Tipagens Canônicas e Estado Global

Pacote central de serviços compartilhados (`@trampotaxa/shared`), modelos canônicos de domínio e gerenciamento de estado global reativo via **Zustand** do ecossistema TrampoTaxa.

---

## 🎯 Propósito e Responsabilidade

O `@trampotaxa/shared` é a **fonte única da verdade** (Single Source of Truth) para todo o monorepo, alimentando a aplicação Web (`apps/web`), o aplicativo Mobile (`apps/mobile`) e alinhado aos backends do sistema:

1. **Tipagens Canônicas (TypeScript Estrito):** Entidades do domínio gastronômico (`Gig`, `ContractorGig`, `FreelancerApplicant`, `User`, `ChatMessage`).
2. **Estado Global com Zustand (Zero Context API para estados mutáveis):**
   - `useFreelancerFlowStore` (`freelancerFlowState.ts`): Controle de turno, máquina de estados, check-in por QR Code e limites de overbooking.
   - `useContractorStore` (`contractorState.ts`): Gestão de vagas do contratante, KPIs automatizados, triagem de candidatos e chat em tempo real.
3. **Formatadores e Validadores Fiscais:** Algoritmo oficial de validação de CNPJ (Módulo 11 da Receita Federal), máscaras de telefone brasileiro e formatação monetária em Real (`R$ 0,00`).
4. **Mock Datasets de Curitiba:** Dados geolocalizados de estabelecimentos (`mockGigs` e `INITIAL_CONTRACTOR_GIGS`) nos bairros Batel, Centro Cívico e arredores.

---

## 📁 Estrutura de Diretórios e Submódulos

```
packages/shared/
├── src/
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
│   ├── utils/                  # Utilitários fiscais, matemáticos e Zustand Stores
│   │   ├── contractorState.ts  # Store Zustand do contratante e cálculo de KPIs
│   │   ├── freelancerFlowState.ts # Store Zustand da jornada do freelancer
│   │   ├── formatters.ts       # Formatação monetária BRL, CNPJ, telefone e data
│   │   ├── gigs.ts             # Cálculos geoespaciais (Haversine) e filtros
│   │   └── README.md           # Documentação detalhada dos utilitários
│   │
│   ├── index.ts                # Ponto de entrada do pacote `@trampotaxa/shared`
│   └── mocks.ts                # Helpers para isolamento de dados de teste
│
├── package.json                # Configuração com React/React-DOM em peerDependencies
└── tsconfig.json               # Configuração TypeScript estrita
```

---

## 🏛️ Stores do Zustand Compartilhadas

### 1. `useFreelancerFlowStore` (`freelancerFlowState.ts`)
Orquestra o ciclo operacional completo do freelancer:
- `applyGig(gigId)`: Aplica à vaga validando a regra inquebrável de até 3 candidaturas ativas.
- `confirmCheckIn(gigId, qrCode)`: Valida o QR Code Mestre físico (`QR_MESTRE_123`) e transiciona para `em_turno`.
- `requestCheckOut()`: Solicita encerramento e abre a janela de contestação de 2 horas.
- `submitReview(rating, comment)`: Envia avaliação do contratante e finaliza o ciclo com agendamento do PIX.

### 2. `useContractorStore` (`contractorState.ts`)
Orquestra o painel do contratante gastronômico:
- `gigs`: Lista reativa de vagas criadas e candidaturas.
- `kpis`: Cálculo automático de total investido, taxa de pontualidade e vagas concluídas (`calculateContractorKPIs`).
- `approveApplicant(gigId, applicantId)`: Aprova o profissional e envia mensagem automática no chat.
- `approveCheckoutImmediately(gigId)`: Liberação instantânea de pagamento sem contestação.
- `disputeCheckout(gigId, reason)`: Abertura de mediação em caso de divergência de horas/serviço.

---

## 🔗 Navegação Modular

* Datasets de Curitiba: [src/data/README.md](./src/data/README.md)
* Tipagens e modelos canônicos: [src/types/README.md](./src/types/README.md)
* Utilitários e Stores Zustand: [src/utils/README.md](./src/utils/README.md)
