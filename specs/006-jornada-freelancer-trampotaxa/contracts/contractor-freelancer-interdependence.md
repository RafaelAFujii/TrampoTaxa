# Contrato de Interdependência: Jornada Freelancer ⟷ Contratante

**Spec**: `specs/006-jornada-freelancer-trampotaxa`  
**Data**: 2026-11-05  
**Status**: Consolidado e Implementado

---

## 1. Matriz de Interdependência de Estados e Ações

| Pilar / Etapa | Ação do Freelancer | Dependência / Impacto no Contratante | Proteção Fail-Closed & Regra de Negócio |
| :--- | :--- | :--- | :--- |
| **1. Overbooking Controlado** | Candidata-se a até 3 vagas simultâneas no mesmo horário. | Contratante visualiza candidatos com badge `⚡ Overbooking Ativo (3 vagas)`. | O primeiro contratante que clica em "Aprovar" garante o freelancer. O sistema cancela automaticamente as candidaturas concorrentes nos outros estabelecimentos, evitando faltas (*no-show*). |
| **2. Scanner QR Code Mestre** | Lê o QR Code físico/tela do gerente (`QR_MESTRE_123`) para iniciar o turno. | Contratante dispõe do botão "Exibir QR Code Mestre do Salão" na Web e no Mobile para apresentar ao freelancer. | A leitura presencial altera o status da vaga para `Freelancer Presente no Salão` com timestamp seguro, impedindo check-ins falsos fora do estabelecimento. |
| **3. Auto-Checkout (2h)** | Solicita o encerramento da taxa ("Finalizar Turno"). | Contratante recebe o turno na **Janela de Contestação (2 horas)**, podendo aprovar na hora ou contestar. | Se o contratante não contestar em 2 horas (aprovação silenciosa/tácita), o valor é aprovado automaticamente e o PIX é agendado, protegendo a remuneração do freelancer. |
| **4. Repasse e Avaliação Mútua** | Avalia o local (1 a 5 estrelas) e acessa o Relatório de Ganhos em verde neon. | Contratante visualiza o feedback da casa, libera o repasse PIX e avalia o profissional. | O pagamento só é concretizado após a validação do turno e avaliação de conformidade. |

---

## 2. Contratos de Dados Atualizados (`@trampotaxa/shared`)

### `ContractorGig`
```typescript
interface ContractorGig {
  // ... campos pré-existentes
  checkInTimestamp?: number;
  checkOutTimestamp?: number;
  autoCheckoutDeadline?: number;
  qrCodeSecret?: string; // "QR_MESTRE_123"
  shiftPhase?: 'aguardando_checkin' | 'em_turno' | 'checkout_pendente' | 'pix_aprovado' | 'contestado';
  disputeReason?: string;
  freelancerReview?: {
    rating: number;
    tags: string[];
    submittedAt?: string;
  };
}
```

### `FreelancerApplicant`
```typescript
interface FreelancerApplicant {
  // ... campos pré-existentes
  isOverbooking?: boolean;
  overbookingSlots?: number;
}
```

---

## 3. Comportamento Operacional do Contratante

1. **Dashboard & Listagem de Vagas**:
   - Vagas preenchidas agora possuem o atalho rápido `⌖ QR Mestre` para gerar ou exibir o código do salão.
   - Vagas com turno em encerramento exibem o botão `✓ Liberar PIX Agora` para aprovação sem esperar a janela de 2h.
2. **Triagem de Candidatos**:
   - Identificação transparente de candidatos com overbooking ativo.
   - Alerta didático ao aprovar: outros estabelecimentos são informados do preenchimento da agenda do freelancer.
