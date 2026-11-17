# Research: Refatoracao visual sem alterar fluxos

## Decision 1: Alterar visual sem tocar nos modulos de dominio

**Decision**: Manter toda regra em `packages/shared` e telas como componentes de renderizacao, limitando arquivos web/mobile a apresentacao e composicao.

**Rationale**: Segue a constituicao do projeto e evita regressao funcional durante a mudanca visual.

**Alternatives considered**:
- Reescrever telas: rejeitado por ampliar o risco e misturar comportamento.
- Criar um tema global unico para web/mobile: rejeitado porque os dois runtimes exigem primitivas diferentes.

## Decision 2: Identidade visual baseada em trabalho urbano

**Decision**: Usar superficies opacas, verde funcional, amarelo pontual e linguagem tipografica compacta em vez do visual neon original.

**Rationale**: A escolha esta ligada ao contexto real de turnos, estabelecimentos e profissionais; reduz padroes genericos de SaaS.

**Alternatives considered**:
- Warm cream e serifas: rejeitado por nao representar a operacao cotidiana do produto.
- Near-black e neon intensos: rejeitado por aumentar a cara de dashboard temporario e gerar excesso de brilho.
- Cards uniformes: rejeitado por esconder a hierarquia real da informacao.

## Decision 3: Padrao responsivo por tarefa

**Decision**: Manter navegacao recorrente e reorganizar cada tela por prioridade de tarefa, sem adicionar novos atalhos ou telas.

**Rationale**: A especificacao exige preservar a arquitetura da informacao e permitir teste comparativo dos fluxos.

**Alternatives considered**:
- Redesenhar a informacao em mobile: rejeitado por alterar a experiência e potencialmente a ordem das acoes.
- Usar largura fixa: rejeitado por comprometer uso responsivo.
