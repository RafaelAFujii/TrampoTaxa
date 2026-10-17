# 📚 TrampoTaxa — Documentação Técnica do Backend & Arquitetura

Este diretório centraliza a documentação de arquitetura, modelagem de banco de dados e contratos de API RESTful do ecossistema TrampoTaxa.

---

## 📑 Índice de Documentos

1. **Especificação da API RESTful (OpenAPI 3.0 / Swagger):**
   - Arquivo canônico: [`packages/shared/openapi.yaml`](../../../packages/shared/openapi.yaml)
   - Contratos de todos os endpoints RESTful (Autenticação, Vagas, Candidaturas, Chat, Avaliações e KPIs).
   - Utilizado pelo gerador [Orval](https://orval.dev/) para gerar clientes e hooks tipados em `packages/shared/src/api/`.

2. **Modelagem de Banco de Dados & MER (Modelo Entidade-Relacionamento):**
   - Arquivo: [`DATABASE_MER.md`](./DATABASE_MER.md)
   - Diagrama DER em Mermaid, dicionário de dados detalhado e código DBML para importação direta no [dbdiagram.io](https://dbdiagram.io/).

3. **Guia de Execução Mobile (Expo Go & React Native):**
   - Arquivo: [`EXPO_GO_GUIDE.md`](./EXPO_GO_GUIDE.md)
   - Passo a passo para testar o aplicativo móvel nativo no smartphone sem compilação prévia de Android Studio ou Xcode.

4. **Relatório da Etapa 02 (Seção 3):**
   - Arquivo: [`RELATORIO_ETAPA_02_SECAO_3.md`](./RELATORIO_ETAPA_02_SECAO_3.md)
   - Evidências institucionais de formulários funcionais, testes unitários e automação CI/CD.
