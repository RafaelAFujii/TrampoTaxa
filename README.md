# 🚀 Loctaxa — Plataforma de Gestão de Taxas e Freelancers

O **Loctaxa** é uma solução digital voltada para a gestão, oferta e contratação de serviços temporários (*taxas*) em estabelecimentos comerciais (restaurantes, bares e casas de eventos) e prestadores de serviços freelancers (garçons, barmans, recepcionistas).

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma stack moderna focada em performance, tipagem estática e produtividade:

* **Linguagem Principal:** [TypeScript](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fwww.typescriptlang.org%2F) (99.4%)
* **Bundler &amp; Build Tool:** [Vite](https://www.google.com/url?sa=E&amp;q=https%3A%2F%2Fvitejs.dev%2F) (`vite.config.ts`)
* **Interface &amp; Componentização:** React / TSX
* **Estilização:** Tailwind CSS
* **Configuração de Ambiente:** Arquivos `.env` (`.env.example`)

---

## 📁 Estrutura do Repositório

```
Loctaxa/
├── src/                  # Código-fonte da aplicação (componentes, telas, navegação)
├── .env.example          # Modelo de variáveis de ambiente
├── .gitignore            # Arquivos e pastas ignorados pelo Git
├── index.html            # Ponto de entrada HTML da aplicação Vite
├── metadata.json         # Metadados e configurações adicionais do projeto
├── package.json          # Dependências e scripts do Node.js
├── tsconfig.json         # Configurações do compilador TypeScript
└── vite.config.ts        # Configurações do ambiente de desenvolvimento Vite

```

---

## ✨ Funcionalidades do Sistema

* **Navegação do Usuário:** Interface responsiva com navegação inferior (*bottom navigation*) e telas dedicadas para perfis de usuário.
* **Módulo de Autenticação:** Acesso seguro com divisão de papéis (Contratante / Freelancer).
* **Mapeamento de Taxas:** Visualização e busca de oportunidades e eventos em aberto.
* **Gestão de Perfil:** Painel do profissional e do estabelecimento contratante.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* Gerenciador de pacotes **npm** ou **yarn**

### Passo a Passo

1. **Clonar o repositório:**  
```  
git clone https://github.com/RafaelAFujii/Loctaxa.git  
cd Loctaxa  
```
2. **Instalar as dependências:**  
```  
npm install  
```
3. **Configurar as Variáveis de Ambiente:**Copie o arquivo `.env.example` para `.env` e preencha as chaves necessárias:  
```  
cp .env.example .env  
```
4. **Iniciar o servidor de desenvolvimento:**  
```  
npm run dev  
```  
Acesse a aplicação no navegador através do endereço exibido no terminal (geralmente `http://localhost:5173` ou `http://localhost:3000`).
5. **Gerar a build de produção:**  
```  
npm run build  
```

---

## 📝 Padronização de Commits

O projeto adota o padrão de **Conventional Commits**:

* `feat:` para novas funcionalidades (ex: `feat: add bottom navigation and user screens`).
* `fix:` para correção de bugs.
* `docs:` para atualizações na documentação.
* `style:` para formatação e ajustes visuais sem alteração de lógica.
