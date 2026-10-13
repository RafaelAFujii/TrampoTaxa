# Modelo Entidade-Relacionamento (MER) - TrampoTaxa (Loctaxa)

Este documento apresenta a modelagem de banco de dados relacional (MER e DER) da plataforma **TrampoTaxa**, projetada para suportar a comunicação síncrona entre o **Front-End Web** e o **Aplicativo Mobile (React Native)**.

---

## 1. Diagrama Entidade-Relacionamento (Mermaid ERD)

```mermaid
erDiagram
    USUARIOS ||--o| PERFIS_FREELANCER : "possui (se role=Freelancer)"
    USUARIOS ||--o| ESTABELECIMENTOS : "gerencia (se role=Contratante)"
    
    ESTABELECIMENTOS ||--o{ TAXAS_GIGS : "publica"
    TAXAS_GIGS ||--o{ CANDIDATURAS : "recebe"
    PERFIS_FREELANCER ||--o{ CANDIDATURAS : "submete"
    
    TAXAS_GIGS ||--o| PERFIS_FREELANCER : "escalado (approved_freelancer_id)"
    TAXAS_GIGS ||--o{ MENSAGENS_CHAT : "possui canal"
    USUARIOS ||--o{ MENSAGENS_CHAT : "envia"

    TAXAS_GIGS ||--o| AVALIACOES : "gera avaliacao pós-turno"
    TAXAS_GIGS ||--o| REPASSES_PAGAMENTOS : "gera comprovante financeiro"

    USUARIOS {
        uuid id PK
        string nome "NOT NULL"
        string email "NOT NULL, UNIQUE"
        string senha_hash "NOT NULL"
        enum papel "Freelancer ou Contratante"
        string telefone
        string avatar_url
        boolean primeiro_acesso "DEFAULT true"
        timestamp criado_em
        timestamp atualizado_em
    }

    PERFIS_FREELANCER {
        uuid id PK
        uuid usuario_id FK "NOT NULL, UNIQUE"
        string profissao_principal "Bartender, Garçom, Cozinheiro..."
        decimal avaliacao_media "1.00 a 5.00"
        int total_turnos_concluidos "DEFAULT 0"
        decimal taxa_pontualidade "0% a 100%"
        text biografia
        jsonb especialidades "['Mixologia', 'Bandeja']"
        boolean disponivel_radar "DEFAULT true"
    }

    ESTABELECIMENTOS {
        uuid id PK
        uuid usuario_id FK "NOT NULL, UNIQUE"
        string razao_social "NOT NULL"
        string nome_fantasia "NOT NULL"
        string cnpj "14 digitos, NOT NULL, UNIQUE"
        string segmento "Restaurante, Bar, Eventos..."
        string logradouro
        string bairro "Batel, Centro, etc."
        string cidade "Curitiba"
        string estado "PR"
        decimal latitude
        decimal longitude
        string telefone_contato
    }

    TAXAS_GIGS {
        uuid id PK
        uuid estabelecimento_id FK "NOT NULL"
        string titulo "NOT NULL"
        string cargo "Bartender, Garçom..."
        string categoria "Turno Normal, Emergência, Especial"
        date data_turno "NOT NULL"
        time horario_inicio "NOT NULL"
        time horario_fim "NOT NULL"
        decimal valor_taxa "NOT NULL em BRL"
        text dress_code "Regras de vestimenta"
        text regras_apresentacao "Microtraining e instrucoes"
        int vagas_totais "DEFAULT 1"
        enum status "Aberta, Aguardando, Preenchida, Finalizada, Cancelada"
        uuid freelancer_aprovado_id FK "Nullable"
        timestamp criado_em
    }

    CANDIDATURAS {
        uuid id PK
        uuid taxa_id FK "NOT NULL"
        uuid freelancer_id FK "NOT NULL"
        enum status "Pendente, Aprovado, Rejeitado"
        boolean favorito_estabelecimento "DEFAULT false"
        timestamp candidatado_em "DEFAULT NOW()"
    }

    AVALIACOES {
        uuid id PK
        uuid taxa_id FK "NOT NULL, UNIQUE"
        uuid avaliador_id FK "NOT NULL (Contratante)"
        uuid avaliado_id FK "NOT NULL (Freelancer)"
        int nota "1 a 5 estrelas"
        text feedback_comentario
        jsonb tags "['Pontual', 'Excelente apresentacao']"
        timestamp avaliado_em
    }

    MENSAGENS_CHAT {
        uuid id PK
        uuid taxa_id FK "NOT NULL"
        uuid remetente_id FK "NOT NULL"
        text mensagem "NOT NULL"
        boolean lida "DEFAULT false"
        timestamp enviada_em "DEFAULT NOW()"
    }

    REPASSES_PAGAMENTOS {
        uuid id PK
        uuid taxa_id FK "NOT NULL, UNIQUE"
        uuid freelancer_id FK "NOT NULL"
        decimal valor_bruto "NOT NULL"
        decimal taxa_plataforma "10% ou fixa"
        decimal valor_liquido "NOT NULL"
        string chave_pix "CPF, CNPJ, Telefone ou Aleatoria"
        string comprovante_codigo "UUID ou hash E2E"
        enum status_pagamento "Pendente, Pago_PIX, Estornado"
        timestamp pago_em
    }
```

---

## 2. Dicionário de Dados e Regras de Negócio

### 2.1 Tabela `USUARIOS`
Centraliza o controle de acesso e autenticação RBAC da plataforma:
* **`id` (UUID, PK):** Identificador universal.
* **`papel` (Enum):** `'Freelancer'` ou `'Contratante'`. Determina a experiência de navegação e permissões.
* **`primeiro_acesso` (Boolean):** Flag que identifica se o usuário precisa concluir o preenchimento de perfil no onboarding.

### 2.2 Tabela `ESTABELECIMENTOS`
Armazena os dados fiscais e geográficos das empresas contratantes:
* **`cnpj` (CHAR(14) ou VARCHAR(18)):** Validado pelo algoritmo dos dígitos verificadores (Módulo 11).
* **`latitude` e `longitude`:** Permitem o cálculo de proximidade euclidiana/geodésica para o radar de oportunidades.

### 2.3 Tabela `TAXAS_GIGS`
Representa os turnos de trabalho temporário:
* **Transições de Status:**
  `Aberta` ➔ `Aguardando Confirmação` ➔ `Preenchida` (quando o contratante aprova o freelancer) ➔ `Finalizada` (após a realização do turno) ➔ `Avaliada & Paga`.

---

## 3. Código DBML (Para importação no dbdiagram.io)

Copie e cole o código abaixo diretamente no [dbdiagram.io](https://dbdiagram.io/):

```dbml
Table usuarios {
  id uuid [pk]
  nome varchar(120) [not null]
  email varchar(180) [unique, not null]
  senha_hash varchar(255) [not null]
  papel varchar(20) [not null] // 'Freelancer' | 'Contratante'
  telefone varchar(20)
  avatar_url varchar(255)
  primeiro_acesso boolean [default: true]
  criado_em timestamp [default: `now()`]
}

Table estabelecimentos {
  id uuid [pk]
  usuario_id uuid [unique, ref: - usuarios.id]
  razao_social varchar(150) [not null]
  nome_fantasia varchar(120) [not null]
  cnpj varchar(18) [unique, not null]
  segmento varchar(60) [not null]
  bairro varchar(60)
  cidade varchar(60) [default: 'Curitiba']
  latitude decimal(10,6)
  longitude decimal(10,6)
}

Table perfis_freelancer {
  id uuid [pk]
  usuario_id uuid [unique, ref: - usuarios.id]
  profissao varchar(60) [not null]
  avaliacao_media decimal(3,2) [default: 5.00]
  total_turnos int [default: 0]
  taxa_pontualidade int [default: 100]
  biografia text
}

Table taxas_gigs {
  id uuid [pk]
  estabelecimento_id uuid [ref: > estabelecimentos.id]
  titulo varchar(120) [not null]
  cargo varchar(50) [not null]
  categoria varchar(40) [not null]
  data_turno date [not null]
  horario_inicio time [not null]
  horario_fim time [not null]
  valor_taxa decimal(10,2) [not null]
  dress_code text
  regras_apresentacao text
  status varchar(30) [default: 'Aberta']
  freelancer_aprovado_id uuid [ref: > perfis_freelancer.id]
}

Table candidaturas {
  id uuid [pk]
  taxa_id uuid [ref: > taxas_gigs.id]
  freelancer_id uuid [ref: > perfis_freelancer.id]
  status varchar(20) [default: 'Pendente']
  favorito boolean [default: false]
  candidatado_em timestamp [default: `now()`]
}

Table avaliacoes {
  id uuid [pk]
  taxa_id uuid [unique, ref: - taxas_gigs.id]
  avaliador_id uuid [ref: > usuarios.id]
  avaliado_id uuid [ref: > perfis_freelancer.id]
  nota int [not null]
  feedback text
  avaliado_em timestamp [default: `now()`]
}

Table mensagens_chat {
  id uuid [pk]
  taxa_id uuid [ref: > taxas_gigs.id]
  remetente_id uuid [ref: > usuarios.id]
  mensagem text [not null]
  lida boolean [default: false]
  enviada_em timestamp [default: `now()`]
}
```
