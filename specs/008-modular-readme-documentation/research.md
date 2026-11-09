# Pesquisa Técnica e Inventário Arquitetural (Research)

## 1. Inventário de Workspaces e Arquivos

O monorepo TrampoTaxa é organizado em quatro workspaces Bun:
1. `apps/web`: Aplicação Web SPA e PWA (React 19, Vite, Tailwind CSS, Workbox).
2. `apps/mobile`: Aplicativo Mobile Expo SDK 51 / React Native com navegação por abas.
3. `apps/server`: Servidor backend Fastify com tRPC v11 e Drizzle ORM sobre SQL Server.
4. `packages/shared`: Pacote compartilhado com contratos OpenAPI, orval hooks, mocks e utilitários.

## 2. Padrão Estrutural de Cada README Modular

Para garantir uniformidade e excelência técnica, cada README de submódulo deve seguir esta estrutura padronizada:
- **Título & Propósito**: O que este diretório/módulo faz e por que ele existe.
- **Tabela de Arquivos & Módulos**: Nome do arquivo, finalidade principal, exportações-chave e dependências.
- **Fluxo de Integração**: Como os arquivos dentro desta pasta se comunicam com o restante do sistema.
- **Diretrizes de Manutenção**: Cuidados ao editar, convenções e testes associados.

## 3. Conformidade com a Regra do Scope Guard

Em respeito estrito ao isolamento de fases:
- O presente arquivo de pesquisa consolida a arquitetura para alimentar o `tasks.md`.
- As modificações nos arquivos de documentação do monorepo serão executadas de forma sequencial assim que a autorização for confirmada.
