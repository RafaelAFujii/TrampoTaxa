# Quickstart: Validacao da refatoracao visual

## Pre-requisitos

- Dependencias instaladas com Bun.
- Projeto na feature `012-visual-refactor-ui`.
- Backend ou dados mock configurados conforme o ambiente atual, apenas para percorrer os fluxos existentes.

## Validacoes web

```powershell
bun run build:web
bun run --filter web test
bun run --filter web lint
```

Abrir o app em larguras desktop e mobile estreita e percorrer:

1. Login e cadastro.
2. Mapa e consulta de vagas.
3. Aceite ou recusas de oferta conforme o perfil.
4. Perfil e configuracoes.
5. Fluxos do contratante: painel, vagas, criacao, chat e relatorios.

Confirmar que cada resultado funcional e igual ao antes da mudanca.

## Validacoes mobile

```powershell
bun run --filter mobile typecheck
bun run --filter mobile test
bun run dev:mobile
```

Percorrer os mesmos cenarios no Expo em largura pequena e em um emulador maior.

## Criterio de conclusao

- Nenhuma rota ou acao mudou.
- Contraste e foco sao perceptiveis.
- Conteudo essencial continua acessivel.
- Os estados continuam consistentes entre telas.
- Nenhuma animacao continua foi introduzida.
