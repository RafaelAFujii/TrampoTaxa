# Interface Contract: Refatoracao visual

## Preservacao obrigatoria

- Todas as rotas existentes permanecem iguais.
- Todos os botoes, links e gestos existentes permanecem presentes e operacionais.
- Todos os labels, estados de sucesso, erro e recuperacao permanecem semanticamente equivalentes.
- Nenhum dado, pedido ou mutacao sera acrescentado por uma mudanca visual.

## Consistencia visual

- Estados positivos usam o verde trabalho e nao brilhos decorativos.
- Alertas usam o vermelho telha apenas para erros ou confirmacoes importantes.
- O amarelo sinal funciona como destaque limitado e nao como superficie dominante.
- Bordas e divisores estruturam grupos; nao servem apenas como ornamentacao.
- Foco de teclado e estados pressionados sao sempre perceptiveis.
- Movimento nao acontece sem acao do usuario e e desativado por preferencia de reducao.

## Responsividade

- Conteudo essencial permanece visivel em larguras estreitas e largas.
- Controles que ja sao acessiveis nao mudam de finalidade nem mudam de ordem.
- Navegacao recorrente continua reconhecivel no web e no mobile.
