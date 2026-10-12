# 🍸 TrampoTaxa (Loctaxa) — Plataforma de Gestão de Taxas e Freelancers

[![CI/CD GitHub Pages](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml/badge.svg)](https://github.com/akirarafael19/trampo-taxa/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest Tests](https://img.shields.io/badge/Tests-22%20Passed-brightgreen?logo=vitest)](https://vitest.dev/)
[![Technical Debt](https://img.shields.io/badge/Débito_Técnico-0%25-brightgreen)](https://eslint.org/)

O **TrampoTaxa (Loctaxa)** é uma plataforma digital desenvolvida para conectar **estabelecimentos gastronômicos** (restaurantes, bares, cervejarias, pubs e casas noturnas) a **profissionais autônomos e freelancers** (bartenders, garçons, cozinheiros, recepcionistas e copeiros) para cobertura de turnos temporários (*taxas*) em tempo real.

---

## 🌐 Links do Projeto

* 🚀 **Aplicação Online (GitHub Pages):** [https://akirarafael19.github.io/trampo-taxa/](https://akirarafael19.github.io/trampo-taxa/)
* 💻 **Repositório no GitHub:** [https://github.com/akirarafael19/trampo-taxa](https://github.com/akirarafael19/trampo-taxa)
* 🧪 **Ambiente de Desenvolvimento (Preview):** [Acessar Applet em Nuvem](https://ais-dev-v6aa5zop4sov5raedzqgg4-97325856245.us-east1.run.app)

---

## 🎯 Principais Funcionalidades

### 1. Para Estabelecimentos Contratantes (B2B)
* **Criação e Publicação de Taxas:** Definição de data, horários, valor em BRL, vagas, regras de apresentação e *dress code* detalhado.
* **Gestão e Triagem de Candidatos:** Visualização do histórico do freelancer, índice de pontualidade, nota de avaliação média e aprovação/rejeição com um clique.
* **Chat Operacional Direto:** Canal de mensagens por turno para alinhamento de portaria de entrada e regras.
* **Relatórios Financeiros e Operacionais:** KPIs de faturamento, média horária gasta, turnos concluídos e emissão de recibos operacionais.
* **Avaliação Pós-Turno:** Módulo de feedback por estrelas e tags de desempenho (ex: *Pontual*, *Ágil*, *Excelente Apresentação*).

### 2. Para Profissionais Freelancers
* **Radar em Tempo Real com Geolocalização:** Marcadores no Google Maps de Curitiba com rotas GPS, distância e previsão de trânsito em tempo real.
* **Consulta e Catálogo de Taxas:** Alternador intuitivo entre visualização de **Mapa** e **Lista de Vagas** no desktop e em smartphones, com filtros por função (*Bartender, Garçom*) e busca textual por estabelecimento ou bairro.
* **Bottom Sheet com Microtreinamento:** Análise prévia das regras de apresentação e conduta antes de aceitar o turno.
* **Turno Ativo & GPS:** Navegação interativa com rota integrada até o estabelecimento contratante.
* **Painel de Ganhos:** Extrato diário, semanal e mensal de valores recebidos via PIX instantâneo.

---

## 🏗️ Arquitetura e Tecnologias

A aplicação foi construída com foco em **Mobile-First**, **tipagem estática rigorosa** e **alta performance**:

* **Front-End Web & Mobile UI:** [React 19](https://react.dev/) com componentes funcionais e hooks.
* **Linguagem:** [TypeScript 5.8](https://www.typescriptlang.org/) com 100% de cobertura de tipos e compilação sem erros (`tsc --noEmit`).
* **Roteamento Central:** [React Router v7](https://reactrouter.com/) utilizando `createBrowserRouter` e rotas protegidas por controle de acesso baseado em papéis (RBAC).
* **Estilização e Design System:** [Tailwind CSS v4](https://tailwindcss.com/) com paleta escura moderna (*dark mode*), contraste semântico e responsividade completa.
* **Geolocalização & Mapas:** `@vis.gl/react-google-maps` com rotas dinâmicas via Google Directions Service.
* **Gerenciamento de Estado Global:** Context API (`AuthContext` e `ContractorContext`) com persistência em armazenamento local.
* **Testes Automatizados (TDD):** [Vitest](https://vitest.dev/) com 22 testes unitários e de integração cobrindo regras de negócio e validações fiscais.
* **Qualidade de Código & Linter:** ESLint 9 (Flat Config), Prettier e SonarLint mantendo débito técnico em **0%**.

---

## 📂 Estrutura de Diretórios

```
trampo-taxa/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline de CI/CD para deploy automático no GitHub Pages
├── docs/
│   ├── openapi.yaml              # Especificação OpenAPI 3.0 (Swagger) para integração mobile/backend
│   ├── DATABASE_MER.md           # Modelo Entidade-Relacionamento (MER/DER), dicionário e DBML
│   └── RELATORIO_ETAPA_02_SECAO_3.md # Relatório institucional da Etapa 02
├── src/
│   ├── __tests__/                # Suíte de testes automatizados (Vitest TDD)
│   │   ├── auth_flow.test.ts
│   │   ├── contractor.test.ts
│   │   ├── formatters.test.ts
│   │   ├── gig_consultation.test.ts
│   │   └── gigs.test.ts
│   ├── components/               # Componentes reutilizáveis de UI, mapa e navegação
│   │   ├── map/                  # Marcadores customizados e integração do mapa
│   │   ├── navigation/           # BottomNavigation para dispositivos móveis
│   │   └── ui/                   # Botões, inputs com máscara e badges
│   ├── context/                  # Provedores de estado global (AuthContext e ContractorContext)
│   ├── data/                     # Dados mockados estruturados de turnos e candidatos
│   ├── layouts/                  # AppLayout com header responsivo e controle de rotas
│   ├── routes/                   # Configuração de rotas com createBrowserRouter e ProtectedRoute
│   ├── screens/                  # Telas do Freelancer (Login, Cadastro, Mapa, Ganhos, Perfil)
│   │   └── contractor/           # Telas do Contratante (Vagas, Criar Taxa, Relatórios, Chat)
│   ├── types/                    # Definições estritas de TypeScript (interfaces e enums)
│   └── utils/                    # Utilitários de formatação e validador algorítmico de CNPJ
├── eslint.config.js              # Configuração oficial do ESLint 9 Flat Config
├── .prettierrc                   # Regras de formatação de código
├── index.html                    # Ponto de entrada SPA com viewport otimizado
├── package.json                  # Dependências, scripts de teste, lint e build
├── tsconfig.json                 # Configuração do compilador TypeScript
└── vite.config.ts                # Configuração do Vite com base relativa para GitHub Pages
```

---

## 🧪 Testes Automatizados (TDD)

A suíte de testes unitários e de integração foi construída com o **Vitest**, validando regras críticas de negócio:

* **Validador de CNPJ (Módulo 11):** Validação matemática dos dígitos verificadores, rejeição de sequências nulas e máscaras monetárias.
* **Fluxo de Autenticação & Cadastro:** Verificação de payloads de Freelancer e Contratante, campos corporativos e controle RBAC.
* **Consulta e Catálogo de Taxas:** Filtros de oportunidades por cargo (*Bartender, Garçom*), busca por bairro (*Batel, Centro Cívico, etc.*) e ordenação por valor.
* **Gestão de Candidatos:** Transições de status de turnos (*Aberta* ➔ *Preenchida* ➔ *Finalizada*) e mensagens associadas.

Para executar os testes:
```bash
npm test
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** (versão 20 ou superior recomendada)
* Gerenciador de pacotes **npm**

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone https://github.com/akirarafael19/trampo-taxa.git
cd trampo-taxa
```

2. **Instalar as dependências:**
```bash
npm install
```

3. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```
Acesse `http://localhost:3000` no navegador.

4. **Executar a análise de código (Linter):**
```bash
npm run lint
```

5. **Executar a formatação com Prettier:**
```bash
npm run format
```

6. **Gerar a compilação de produção:**
```bash
npm run build
```

---

## 📚 Documentação Técnica Adicional

* 📄 **APIs RESTful (OpenAPI / Swagger):** Consulte o arquivo [`docs/openapi.yaml`](./docs/openapi.yaml) para detalhes de parâmetros, cabeçalhos de autorização e códigos de retorno HTTP.
* 🗄️ **Modelagem de Dados (MER):** Consulte o arquivo [`docs/DATABASE_MER.md`](./docs/DATABASE_MER.md) para visualizar o DER em Mermaid e o código pronto para importação no [dbdiagram.io](https://dbdiagram.io/).
* 📋 **Relatório da Etapa 02 (Seção 3):** Consulte [`docs/RELATORIO_ETAPA_02_SECAO_3.md`](./docs/RELATORIO_ETAPA_02_SECAO_3.md) com as evidências das conexões de formulários e CI/CD.

---

## 📄 Licença e Uso

Este projeto foi desenvolvido para fins educacionais e de demonstração profissional na área de tecnologia e gastronomia.
