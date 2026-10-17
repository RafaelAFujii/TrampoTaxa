# RELATÓRIO TÉCNICO DE DESENVOLVIMENTO - ETAPA 02

**Projeto:** TrampoTaxa (Loctaxa) - Plataforma de Gestão de Turnos e Taxas Gastronômicas  
**Público-Alvo:** Bares, Restaurantes, Casas de Eventos e Profissionais Freelancers de Curitiba/PR  
**Tecnologias Centrais:** ReactJS 19, TypeScript 5.8, Tailwind CSS, React Router v7, Vitest, ESLint  

---

## 3. IMPLEMENTAÇÃO E CONEXÃO DAS FUNCIONALIDADES (SEÇÃO 3)

### 3.1 Identificação e Links de Acesso

* **Link do Repositório no GitHub:**  
  `https://github.com/akirarafael19/trampo-taxa`
* **Link da Aplicação Publicada (GitHub Pages):**  
  `https://akirarafael19.github.io/trampo-taxa/`
* **Ambiente de Desenvolvimento Ativo (Preview):**  
  `https://ais-dev-v6aa5zop4sov5raedzqgg4-97325856245.us-east1.run.app`

---

### 3.2 Conexão dos Formulários e Lógica das 3 Funcionalidades Principais

#### Funcionalidade 1: Autenticação e Login (`LoginScreen.tsx` ➔ `AuthContext.tsx`)
* **Descrição da Implementação:**  
  A tela de login foi plenamente conectada ao provedor de autenticação (`AuthContext`). Ela suporta a alternância fluida entre os perfis **Freelancer** e **Contratante (B2B)**.
* **Comportamento e Validações:**
  - Armazenamento de sessão e persistência no `localStorage`.
  - Tratamento de estados de carregamento (`isLoading`) e feedback visual de erros.
  - Redirecionamento condicional inteligente via React Router: ao logar como *Contratante*, o usuário é direcionado para a gestão de taxas (`/contractor/gigs`); ao logar como *Freelancer*, é direcionado para o mapa de vagas ativas (`/map`).

#### Funcionalidade 2: Cadastro de Usuário e Estabelecimento (`CadastroScreen.tsx` ➔ `AuthContext.tsx`)
* **Descrição da Implementação:**  
  O formulário de cadastro coleta os dados essenciais para ambos os tipos de usuário, aplicando regras de negócio e validações fiscais rigorosas.
* **Validações Implementadas:**
  - **Validação Algorítmica de CNPJ (Módulo 11):** Implementada em `src/utils/formatters.ts` (`isValidCNPJ`), rejeitando sequências nulas e dígitos verificadores inconsistentes.
  - **Máscaras de Entrada em Tempo Real:** Formatação automática para CNPJ (`00.000.000/0000-00`) e Telefone com DDD (`(41) 99999-0000`).
  - **Campos Específicos:** Coleta de Razão Social, Nome Fantasia e Segmento (Restaurante, Bar, etc.) para contratantes, e cargo principal para freelancers.
  - Ativação da flag `primeiroAcesso: true`, integrando a jornada de onboarding.

#### Funcionalidade 3: Consulta e Lista de Taxas/Vagas (`MapDashboardScreen.tsx` e `ContractorGigsScreen.tsx`)
* **Descrição da Implementação:**
  - **Visão do Freelancer:** Permite consultar vagas de duas maneiras sincronizadas:
    1. **Mapa Interativo (Geolocalização):** Marcadores no mapa de Curitiba com indicação de distância, valor e bairro.
    2. **Lista e Busca de Taxas (Desktop Sidebar e Mobile):** No smartphone, o botão *"Ver Lista"* abre o catálogo dinâmico de turnos com pesquisa textual (por estabelecimento, bairro ou função) e filtros rápidos (*Todos, Bartender, Garçom*). Ao selecionar uma vaga, abre-se o Bottom Sheet com detalhes e botão de candidatura imediata.
  - **Visão do Contratante:** Painel em `ContractorGigsScreen` com filtro por abas de status (*Abertas, Aguardando Confirmação, Preenchidas, Finalizadas*), busca em tempo real e visualização detalhada do histórico de candidatos por turno.

---

### 3.3 Integração Contínua e Publicação (CI/CD no GitHub Pages)

Para atender à entrega da aplicação online, foi configurado o pipeline de automação via GitHub Actions no arquivo `.github/workflows/deploy.yml`:

```
+--------------------------------------------------------------+
|                   PIPELINE DE INTEGRAÇÃO (CI/CD)             |
+--------------------------------------------------------------+
| 1. Git Push (main/master)                                    |
|    |                                                         |
| 2. Checkout & Setup Node.js 20                               |
|    |                                                         |
| 3. Lint & Typecheck: npm run lint (ESLint 9 + TypeScript 5)  |
|    |                                                         |
| 4. Testes Automatizados: npm test (Vitest TDD)               |
|    |                                                         |
| 5. Build de Produção: npm run build (Vite com base: './')    |
|    |                                                         |
| 6. Deploy Automatizado no GitHub Pages (actions/deploy-pages)|
+--------------------------------------------------------------+
```

* **Compatibilidade de Rotas:** O arquivo `vite.config.ts` foi configurado com `base: './'` para garantir que os arquivos estáticos (CSS, JS, imagens) sejam servidos com caminhos relativos corretos independentemente do subdiretório do repositório no GitHub Pages.

---

### 3.4 Métricas de Qualidade Técnica e Débito Técnico

* **Débito Técnico:** **0%** (estritamente abaixo dos 10% exigidos).
* **Análise Estática (ESLint + SonarLint):**  
  Execução de `npm run lint` concluída com **0 erros** e **0 advertências**. Todo o código está padronizado sob o guia do TypeScript ESLint e Prettier.
* **Testes Automatizados (TDD):**  
  Suíte de testes desenvolvida com o test runner **Vitest**, validando:
  1. Cálculos de dígitos verificadores de CNPJ e formatações monetárias (`formatters.test.ts`).
  2. Integridade dos dados de turnos e filtragem de cargos (`gigs.test.ts`).
  3. Estados de aprovação de candidatos e fluxo do contratante (`contractor.test.ts`).
  4. Fluxos de autenticação e validação de permissões RBAC (`auth_flow.test.ts`).

---

### 3.5 Arquivos de Suporte da Etapa 03 Disponibilizados no Repositório

1. **Especificação de APIs (OpenAPI / Swagger):** Contrato canônico em `packages/shared/openapi.yaml`; a geração Orval está configurada em `packages/shared/orval.config.ts`.
2. **Modelagem de Dados Relacional (MER / DER):** Disponível em `/docs/DATABASE_MER.md` com código DBML para importação direta no *dbdiagram.io*.
