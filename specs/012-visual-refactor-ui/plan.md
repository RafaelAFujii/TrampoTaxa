# Implementation Plan: Refatoracao visual sem alterar fluxos

**Branch**: `012-visual-refactor-ui` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-visual-refactor-ui/spec.md`

## Summary

Refatorar a apresentacao visual das interfaces web e mobile da TrampoTaxa sem alterar rotas, regras, dados, interacoes ou resultados. A implementacao concentrara a mudanca em hierarquia, paleta, tipografia, espacamento, estados visuais e feedback dos componentes, mantendo os hooks e modulos de negocio existentes.

## Technical Context

**Language/Version**: TypeScript 6.0.3; React 19.3.0; React Native 0.88.1

**Primary Dependencies**: Tailwind CSS 4.3.5 no web; React Native StyleSheet no mobile; Lucide no web; React Navigation no mobile

**Storage**: Nao aplicavel; nao ha mudanca de persistencia

**Testing**: Vitest/Bun Test; build e typecheck dos apps; revisao responsiva e visual

**Target Platform**: Navegadores desktop/mobile e aplicativos Expo Android/iOS

**Project Type**: Monorepo com aplicacoes web e mobile que compartilham inteligencia em `packages/shared`

**Performance Goals**: Preservar tempo de interacao percebido e evitar animacoes continuas

**Constraints**: Nao alterar fluxo, rotas, contratos tRPC, stores, hooks ou comportamento; telas continuam Dumb UI

**Scale/Scope**: Layout principal, navegacao, modais, estados vazios/erro e componentes compartilhados existentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **tRPC como fonte unica**: Passa. Nenhum contrato ou chamada sera criado ou alterado.
- **Dumb UI e shared**: Passa. Regras e estado permanecem nos modulos existentes.
- **Estado**: Passa. Zustand, React Query e hooks existentes permanecem intactos.
- **Mobile/Metro**: Passa. Nenhuma mudanca de bundling ou workspace.
- **TDD e qualidade**: Passa mediante testes de regressao funcional existentes e testes visuais/automatizados proporcionais.
- **Anti-bloat**: Passa. Reutiliza componentes e arquivos existentes.

## Project Structure

### Documentation (this feature)

```text
specs/012-visual-refactor-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-contract.md
├── spec.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
apps/web/src/
├── layouts/
├── screens/
├── components/
└── index.css

apps/mobile/src/
├── screens/
└── components/

packages/shared/src/
└── hooks and domain logic without visual changes
```

**Structure Decision**: Manter a estrutura existente e alterar somente os pontos de renderizacao web/mobile. Nenhum novo dominio ou endpoint sera criado.

## Frontend Design

**Subject, audience, and primary job**: TrampoTaxa atende profissionais que encontram turnos e estabelecimentos que contratam trabalho temporario. A interface precisa ajudar esses publicos a localizar, decidir e concluir uma escala ou vaga com rapidez. O primeiro plano visual sera funcional: mapa, oportunidades e acoes principais; nao estatisticas decorativas ou slogans abstratos.

**Color**:
- Asfalto profundo: `#171B1A` para superfícies principais.
- Concreto claro: `#E7ECE8` para superficies de leitura.
- Verde trabalho: `#34745A` para estados positivos e confirmacoes.
- Sinal amarelo: `#E3B23C` para destaque moderado e atencao.
- Vermelho telha: `#B85C3D` para erros e situacoes que exigem confirmacao.
- Branco gelado: `#F7F9F7` para texto sobre superficies claras.

**Type**: Familia `Archivo` para titulos e numeros curtos, com peso 600-800 e largura compacta; `Public Sans` para corpo, formulario e labels, com peso 400-600. Fallback seguro para sistema. Titulos ficam alinhados a esquerda e com linhas curtas; corpo usa largura contida.

**Layout**: Preservar a arquitetura atual, mas substituir superfícies em excesso por paineis, bordas e divisores com hierarquia funcional. No desktop, o mapa ou conteudo principal ocupa a area util e o painel contextual fica em coluna estreita quando necessario; a navegacao permanece previsivel. No mobile, as acoes de maior frequencia ficam no topo ou proximo da area de alcance sem esconder o conteudo. Nada sera centralizado por padrao.

**Wireframes**:

```text
Desktop atual:
+------------------------------------------------------+
| Logo     Navegacao principal        Perfil / sair    |
+------------------------------------------------------+
| Conteudo principal                  | Contexto       |
| mapa/lista/turnos                   | detalhes       |
+------------------------------------------------------+

Mobile:
+--------------------------------+
| Logo / titulo / acao primaria  |
+--------------------------------+
| conteudo e tarefa atual        |
|                                |
|                                |
+--------------------------------+
| navegacao recorrente           |
+--------------------------------+
```

**Principles**:
- Substituir o visual neon e as sombras luminosas por contraste material, bordas finas e superficies opacas.
- Usar a paleta verde como sinal funcional, nao como filtro universal.
- Aplicar tokens visuais consistentes a botoes, cards, estados e navegacao.
- Remover decoracao que nao comunica hierarquia ou estado.
- Preservar todos os textos de acao e resultados do produto; alterar apenas apresentacao.

**Uniqueness review**: Um painel escuro com neon, gradientes e cards duplicados seria facilmente trocavel por outro SaaS de produtividade. O plano muda a direcao para uma interface de trabalho urbano com acabamento concreto: superficies opacas, verdes de sinalizacao, amarelo pontual, bordas estruturais e tipografia de uso profissional. Cards nao sao removidos quando representam conteudo real, mas deixam de ser o recurso visual dominante.

## Complexity Tracking

Nenhuma violacao da constituicao exige justificacao.
