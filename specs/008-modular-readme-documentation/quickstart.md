# Guia Rápido de Documentação Modular (Quickstart)

Este guia rápido explica como navegar pela malha de documentação do monorepo TrampoTaxa e como verificar sua integridade.

## 1. Como Navegar na Documentação

1. **Visão Geral**: Comece pelo `/README.md` raiz para entender o propósito do projeto, a stack tecnológica, os comandos gerais e os diagramas de fluxo do Freelancer e do Contratante.
2. **Por Workspace**: Se você estiver desenvolvendo em uma aplicação ou pacote específico, consulte:
   - `/apps/server/README.md` para o backend tRPC e Drizzle ORM
   - `/apps/web/README.md` para a aplicação Web SPA/PWA
   - `/apps/mobile/README.md` para o app React Native / Expo
   - `/packages/shared/README.md` para tipos, contratos e API compartilhada
3. **Por Submódulo/Camada**: Se você precisar alterar um arquivo específico (por exemplo, um router de backend ou uma tela de mobile), acesse o `README.md` no diretório daquela camada para ver o mapa detalhado de cada arquivo.

## 2. Verificação de Integridade

Após a implementação dos READMEs, a validação de integridade deve confirmar:
- Inexistência de links quebrados entre os arquivos markdown.
- Conformidade de todos os scripts documentados com o `package.json`.
- Aderência aos princípios da Constituição do TrampoTaxa.
