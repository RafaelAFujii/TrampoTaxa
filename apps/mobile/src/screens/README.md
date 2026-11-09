# 📱 Mobile Screens Catalog (`apps/mobile/src/screens`)

Este diretório contém todas as telas nativas do aplicativo TrampoTaxa Mobile, implementadas em React Native puro com foco em ergonomia, listas fluidas com pull-to-refresh e responsividade em smartphones iOS e Android.

---

## 📋 Arquivos e Telas do Diretório

### 1. Telas da Jornada do Freelancer

| Arquivo | Aba / Rota | Descrição Funcional |
| :--- | :--- | :--- |
| **`MapScreen.tsx`** | Aba *Radar* | Radar geoespacial com visualização de vagas em Curitiba, chips de remuneração (`R$ 220,00`) e alternador para FlatList de vagas |
| **`ActiveShiftScreen.tsx`** | Modal / Turno | Painel do turno ativo com dados de endereço, contato com o gerente e validação de check-in via Master QR Code |
| **`EarningsScreen.tsx`** | Aba *Ganhos* | Extrato de rendimentos nativo com faturamento diário, semanal e mensal, e histórico de pagamentos PIX |
| **`HighDopamineEarningsScreen.tsx`** | Celebração | Tela animada com feedback tátil de alta dopamina exibida quando uma nova diária cai na conta |
| **`ProfileScreen.tsx`** | Aba *Perfil* | Reputação do profissional (`4.9 ★`), total de turnos realizados, pontualidade e chave PIX |

---

### 2. Telas da Jornada do Contratante (B2B)

| Arquivo | Aba / Rota | Descrição Funcional |
| :--- | :--- | :--- |
| **`ContractorGigsScreen.tsx`** | Gestão | Painel com lista de vagas ativas e contagem de candidaturas pendentes |
| **`CreateGigScreen.tsx`** | Cadastro | Formulário otimizado para smartphone para publicação de vagas emergenciais em bares |
| **`ContractorReportsScreen.tsx`** | Métricas | Relatórios consolidados de investimentos em diárias e horas de salão contratadas |
| **`ContractorChatScreen.tsx`** | Chat | Chat operacional em tempo real para instruções de chegada com os freelancers |

---

## 🏛️ Boas Práticas Mobile

* **Performance:** Todas as listas extensas utilizam `FlatList` com `keyExtractor` determinístico e `getItemLayout` quando aplicável.
* **Pull-to-Refresh:** As telas principais suportam atualização puxando a tela para baixo (`RefreshControl`).
* **Segurança:** Nenhuma chave secreta ou credencial é salva estaticamente no bundle do aplicativo.
