# Feature Specification: Reestruturação e Padronização dos READMEs com Fluxos de Uso

**Feature Branch**: `004-readme-flows-overhaul`

**Created**: 2026-10-28

**Status**: In Progress

**Input**: User description: "atualize todos os readme.md, conforme local, do projeto, do mobile e web, quero que fique organizado, intuitivo e com criação dos fluxos de uso, tanto com visão contratante, como visão do freelance. Lembrando que o redme do projeto ter informações de desenvolvimento, instação e orientação. Pode dar sugestões do que pode ser adicionando tambem"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Onboarding Visual e Entendimento dos Fluxos de Negócio (Priority: P1)

Como um desenvolvedor, stakeholder ou novo colaborador que acessa o repositório raiz do TrampoTaxa, preciso encontrar no `README.md` diagramas visuais (Mermaid e ASCII) das jornadas completas de uso do Freelancer e do Contratante, bem como o mapeamento da topologia do monorepo, para que eu possa compreender intuitivamente como o ecossistema funciona sem precisar ler o código-fonte.

**Why this priority**: É a primeira impressão do projeto e a fonte de verdade sobre o ciclo operacional do produto.

**Independent Test**: Um leitor sem acesso prévio ao sistema consegue desenhar o ciclo de vida de uma taxa gastronômica (da publicação ao PIX) e localizar a pasta exata de cada componente apenas lendo o README raiz.

**Acceptance Scenarios**:
1. **Given** a leitura do `README.md` raiz, **When** o usuário consulta as jornadas, **Then** encontra os diagramas Mermaid de Freelancer e Contratante com todos os passos operacionais descritos.
2. **Given** a seção de arquitetura, **When** o desenvolvedor busca pela organização, **Then** encontra a árvore visual com descrições das pastas `apps/web`, `apps/mobile` e `packages/shared`.

---

### User Story 2 - Guia de Desenvolvimento, Instalação e Resolução de Problemas (Priority: P2)

Como um engenheiro de software configurando o ambiente pela primeira vez, preciso encontrar instruções claras de instalação com Bun, comandos para execução simultânea ou isolada dos módulos, descrição das variáveis de ambiente e uma seção dedicada de Troubleshooting (resolução de portas bloqueadas, cache de bundler e conflitos de dependências).

**Why this priority**: Evita atritos técnicos de configuração local e falhas no ambiente de desenvolvimento.

**Independent Test**: Executar os comandos de instalação e inicialização descritos em uma máquina limpa e conseguir subir a aplicação sem erros em menos de 2 minutos.

**Acceptance Scenarios**:
1. **Given** um ambiente recém-clonado, **When** o desenvolvedor executa `bun install` e `bun run dev:web`, **Then** a aplicação sobe na porta 3000 sem conflitos.
2. **Given** um erro de porta 3000 em uso, **When** o desenvolvedor consulta o Troubleshooting, **Then** encontra o comando exato para matar processos órfãos e reiniciar com sucesso.

---

### User Story 3 - Guias Especializados de Web, Mobile e Shared (Priority: P3)

Como um desenvolvedor frontend ou mobile, preciso abrir os READMEs específicos de cada subprojeto (`apps/web`, `apps/mobile`, `packages/shared`) e encontrar orientações direcionadas:
- No **Web**: arquitetura React 19 + PWA, mapa full-bleed sem faixas em branco, clustering e regras de layout.
- No **Mobile**: inicialização rápida com Expo Go via QR Code / modo túnel, navegação por abas e consumo direto do `@trampotaxa/shared`.
- No **Shared**: tabela detalhada de endpoints da API RESTful OpenAPI 3.0 e comando de geração Orval.

**Why this priority**: Permite que desenvolvedores foquem no seu módulo de atuação sem sobrecarga de informações irrelevantes.

**Independent Test**: Seguir o guia do `apps/mobile/README.md` e abrir o aplicativo no smartphone via Expo Go com sucesso.

**Acceptance Scenarios**:
1. **Given** o diretório `apps/mobile`, **When** o desenvolvedor consulta o README, **Then** encontra instruções limpas para Expo Go sem complexidade desnecessária de EAS.
2. **Given** o diretório `packages/shared`, **When** o desenvolvedor consulta o README, **Then** encontra a matriz de endpoints da API com métodos, rotas e descrições.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O `README.md` raiz DEVE conter diagramas Mermaid e ASCII ilustrando os fluxos de ponta a ponta tanto da **visão do Freelancer** quanto da **visão do Contratante**.
- **FR-002**: O `README.md` raiz DEVE conter a árvore de diretórios detalhada do monorepo Bun, explicando a finalidade de cada pacote.
- **FR-003**: O `README.md` raiz DEVE incluir um guia completo de instalação, variáveis de ambiente necessárias e comandos de desenvolvimento com Bun.
- **FR-004**: O `README.md` raiz DEVE incluir uma seção prática de **Troubleshooting** para diagnóstico e resolução de problemas comuns (portas 3000/3001 presas, cache do Bun e Vite).
- **FR-005**: O `apps/web/README.md` DEVE documentar o mapa full-bleed, PWA Workbox offline, o fluxo de uso web e a remoção de botões de depuração.
- **FR-006**: O `apps/mobile/README.md` DEVE focar em um Quick Start didático com **Expo Go**, explicando como rodar via QR code local e `--tunnel`.
- **FR-007**: O `packages/shared/README.md` DEVE conter a documentação dos contratos de API OpenAPI 3.0, Orval e validação fiscal de CNPJ Módulo 11.
- **FR-008**: Todas as alterações em arquivos de README fora de `specs/` DEVEM ser realizadas EXCLUSIVAMENTE após a autorização da fase de implementação (`implement`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos READMEs do monorepo (Raiz, Web, Mobile e Shared) padronizados e atualizados com design visual atraente.
- **SC-002**: Presença de pelo menos 2 diagramas Mermaid completos representando os fluxos de usuário no README principal.
- **SC-003**: Zero comandos quebrados ou desatualizados em qualquer parte da documentação.
- **SC-004**: Guia de onboarding com tempo de leitura inferior a 5 minutos para compreensão total do projeto.
