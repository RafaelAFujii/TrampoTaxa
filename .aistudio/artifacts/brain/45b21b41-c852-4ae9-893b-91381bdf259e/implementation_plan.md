# Plano de Especificação: Dashboard Principal do Contratante

Plano formal para a criação do **Dashboard Executivo e Operacional do Contratante** no TrampoTaxa, atendendo às necessidades de gestão em tempo real de estabelecimentos gastronômicos.

> [!IMPORTANT]
> **Conformidade com a Regra de Ouro do Spec-Kit (Scope Guard):**  
> Estamos na fase de **Especificação/Planejamento**. Nenhum arquivo de código fora de `specs/005-contractor-dashboard/` foi alterado. A implementação do código real será iniciada assim que você aprovar o plano e enviar o comando **`implement`**.

---

## 1. Visão Geral da Funcionalidade

A tela principal do Contratante (atualmente direcionada para a lista simples de vagas) será transformada em um **Dashboard Executivo Inteligente**, consolidando:

1. **Resumo das Taxas Abertas & Operação**:
   - Total de vagas abertas e vagas totais disponíveis.
   - Candidaturas pendentes aguardando triagem com badge de atenção.
   - Turnos confirmados para o dia de hoje.
2. **Relatório da Semana**:
   - Total investido na semana corrente (R$) com indicador percentual.
   - Gráfico diário simplificado dos últimos 7 dias (destacando dias de pico: sex/sáb).
   - Total de horas cobertas e média por turno.
3. **Central de Mensagens Pendentes**:
   - Contador de mensagens ativas e não lidas de freelancers.
   - Prévia das últimas mensagens com remetente, turno e timestamp.
   - Botão direto para responder abrindo a conversa no chat.
4. **Próximos Turnos & Sugestões de Alto Valor**:
   - Lista dos turnos de hoje com nome do freelancer, horário e status de confirmação.
   - Alerta de risco operacional quando uma vaga próxima do horário ainda não tem candidato aprovado.
   - Atalhos de ação rápida: "Criar Nova Taxa", "Ver Todas as Vagas", "Exportar Relatório".

---

## 2. Estrutura de Arquitetura e Rotas

- **Nova Tela**: `apps/web/src/screens/contractor/ContractorDashboardScreen.tsx`
- **Nova Rota Primária**: `/contractor/dashboard` (redirecionamento pós-login e raiz para o Contratante)
- **Menu e Abas de Navegação Atualizados**:
  - `Dashboard` (Início) -> `/contractor/dashboard`
  - `Minhas Vagas` -> `/contractor/gigs`
  - `Publicar Vaga` -> `/contractor/create`
  - `Mensagens` -> `/contractor/chat`
  - `Relatórios` -> `/contractor/reports`

---

## 3. Arquivos do Spec-Kit Criados

- `specs/005-contractor-dashboard/spec.md`: Especificação de requisitos, cenários de usuário e critérios de aceite.
- `specs/005-contractor-dashboard/checklists/requirements.md`: Checklist completo de validação.
- `specs/005-contractor-dashboard/tasks.md`: Lista sequencial das tarefas de execução.

---

## 4. Próximos Passos (Aguardando Aprovação)

Assim que você revisar e aprovar esta especificação, envie a mensagem:
👉 **`implement`**

Ao receber o comando, executaremos rigorosamente as tarefas `T001` a `T005` do `tasks.md`, realizando as alterações nos arquivos reais com validação de testes (`bun test`) e compilação (`compile_applet`).
