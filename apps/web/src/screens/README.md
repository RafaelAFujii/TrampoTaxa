# 📺 Web Screens Catalog (`apps/web/src/screens`)

Este diretório contém as telas completas da aplicação Web TrampoTaxa, divididas entre as jornadas de **Freelancer**, **Contratante** e telas de **Acesso**.

---

## 📋 Arquivos e Módulos do Diretório

### 1. Telas de Acesso e Autenticação

| Arquivo | Rota Associada | Descrição Funcional |
| :--- | :--- | :--- |
| **`LoginScreen.tsx`** | `/login` | Formulário de autenticação com validação de formato de e-mail e senha, com links para cadastro e alternância fluida |
| **`CadastroScreen.tsx`** | `/cadastro` | Cadastro completo com seletor de perfil (*Freelancer* / *Contratante*), validação de CPF ou CNPJ e termos de uso |

---

### 2. Telas da Jornada do Freelancer

| Arquivo | Rota Associada | Descrição Funcional |
| :--- | :--- | :--- |
| **`MapDashboardScreen.tsx`** | `/` ou `/map` | Radar de oportunidades em tela cheia (full-bleed) com clustering do Google Maps e fallback vetorial |
| **`GigOfferBottomSheet.tsx`** | Modal / Sheet | Drawer de detalhes da vaga contendo valor (R$), horário, briefing de traje e botão de aceite |
| **`ActiveGigScreen.tsx`** | `/active-gig` | Painel do turno em andamento com status, endereço, botão de contato e acionamento de check-in |
| **`EarningsScreen.tsx`** | `/earnings` | Extrato financeiro com total acumulado no dia, semana e mês, e listagem de turnos pagos via PIX |
| **`ProfileScreen.tsx`** | `/profile` | Dados do autônomo, avaliações acumuladas (estrelas), taxa de pontualidade e chave PIX |
| **`SettingsScreen.tsx`** | `/settings` | Configurações de notificações, suporte e preferências de tema |

---

### 3. Telas da Jornada do Contratante (`contractor/`)

| Arquivo | Rota Associada | Descrição Funcional |
| :--- | :--- | :--- |
| **`contractor/ContractorDashboardScreen.tsx`** | `/contractor` | Painel geral de indicadores do estabelecimento, vagas em destaque e atalhos rápidos |
| **`contractor/ContractorGigsScreen.tsx`** | `/contractor/gigs` | Gestão de vagas com filtros por abas (*Abertas*, *Aguardando Confirmação*, *Preenchidas*, *Finalizadas*) |
| **`contractor/CreateGigScreen.tsx`** | `/contractor/create` | Formulário de criação de vagas com cálculo automático de remuneração horária e dress code |
| **`contractor/ContractorReportsScreen.tsx`** | `/contractor/reports` | Relatórios de custos com freelancers, horas de cobertura e média por turno |
| **`contractor/ContractorChatScreen.tsx`** | `/contractor/chat` | Mensageria com a equipe selecionada para alinhamento operacional |
| **`contractor/FreelancerProfileModal.tsx`** | Modal | Visualização detalhada do histórico do candidato antes da aprovação |
| **`contractor/MasterQrCodeModal.tsx`** | Modal | Exibição em alta resolução do Master QR Code do local para check-in do profissional |
| **`contractor/PerformanceReviewModal.tsx`** | Modal | Avaliação pós-turno do profissional com nota de 1 a 5 estrelas e comentários |
