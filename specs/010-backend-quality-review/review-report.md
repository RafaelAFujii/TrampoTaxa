Relatório de Qualidade do Backend .NET

**Data**: 2026-11-12
**Escopo**: `apps/server-dotnet`
**Conclusão**: `blocked` — foram confirmados riscos críticos/altos no código e não foi possível executar build ou testes neste ambiente.

## Resumo executivo

A revisão estática identificou problemas importantes de autorização, exposição de dados e configuração. As rotas não apresentam proteção de autorização nos controllers, um endpoint retorna uma entidade com relacionamentos de usuário sem projeção segura, e há segredos de fallback compilados no código. Também foram encontrados riscos de consistência no fluxo de turnos, no limite de candidaturas e no isolamento dos testes.

Não recomendo considerar este backend pronto para uso exposto até corrigir e validar os achados críticos/altos. A conclusão sobre implantação permanece limitada: não foi verificado se o backend está publicado nem qual configuração é usada em produção.

O responsável confirmou que as contas/senhas são fictícias e que as configurações de conexão/JWT são usadas apenas localmente. Também solicitou testes de desempenho/carga como linha de base, sem aprovação/reprovação até haver metas; esses testes ainda não foram executados.

## Escopo e exclusões

**Incluído e revisado**:

- Controllers em `apps/server-dotnet/src/TrampoTaxa.Api/Controllers/`.
- Inicialização, persistência, entidades, DTOs e serviço de token em `apps/server-dotnet/src/TrampoTaxa.Api/`.
- Projetos, configurações e testes em `apps/server-dotnet/`.
- Inventário Git dos artefatos `bin/` e `obj/` desse backend.

**Excluído**:

- O backend Node/tRPC, os aplicativos Web/Mobile e a infraestrutura externa.
- Acesso a dados ou serviços de produção, testes de intrusão e testes de carga.
- Correções no código, alterações de configuração, remoção de arquivos e mudanças no banco.

A Constituição do repositório identifica o backend tRPC como canônico, enquanto este escopo é o backend .NET selecionado pelo usuário. A divergência fica registrada como questão de arquitetura/ownership; não foi alterada nesta avaliação.

## Disposição dos componentes revisados

| Componente | Disposição |
|---|---|
| Cinco controllers | Revisados; achados F-001, F-002 e F-004 a F-007. |
| Pipeline e configuração da API | Revisados; achados F-001 e F-003; o responsável informa que os valores de conexão/JWT são apenas locais, sem inspeção independente do ambiente de implantação. |
| Persistência, entidades, DTOs e serviço JWT | Revisados; achados F-002, F-006 e F-007. |
| Projetos, dependências e configurações de execução | Revisados estaticamente; SDK ausente impediu build e auditoria automatizada de dependências. |
| Testes de integração | Revisados; cobertura e lacunas descritas abaixo; execução bloqueada. |
| Requisição HTTP de desenvolvimento | Revisada; referência desatualizada descrita no achado F-009. |

## Verificações

| Verificação | Estado | Comando/método e evidência |
|---|---|---|
| Leitura estática de código, configuração e testes | `failed` | Revisão dos arquivos de produção e testes listados no escopo; achados F-001 a F-009 abaixo. |
| Proteção das rotas | `failed` | Busca por `[Authorize]`, `RequireAuthorization` e política global não encontrou proteção nos controllers; foram encontrados apenas `UseAuthentication`/`UseAuthorization` no pipeline. |
| Disponibilidade do SDK | `blocked` | `dotnet --version` informou que nenhum .NET SDK está instalado. |
| Build da solução | `blocked` | `dotnet build apps/server-dotnet/TrampoTaxa.sln` não executado: o SDK necessário não está disponível. |
| Testes de integração | `blocked` | `dotnet test apps/server-dotnet/tests/TrampoTaxa.Api.Tests/TrampoTaxa.Api.Tests.csproj` não executado: SDK ausente e nenhum banco de teste descartável isolado foi confirmado. |
| Desempenho/carga | `blocked` | `k6 run --vus 10 --duration 30s --env BASE_URL=http://localhost:5286 apps/server-dotnet/tests/performance/baseline.js` não executado: .NET SDK ausente, k6 não instalado e nenhum banco/API descartável isolado confirmado. O perfil planejado é 10 VUs por 30 segundos, somente `GET /api/gigs`; ainda não há métricas observadas. |
| Segurança do ambiente de testes | `blocked` | `Program.cs` chama `DbInitializer.Seed` na inicialização; os testes persistem dados e não estabelecem um banco isolado no fixture. Não foi encontrado override de conexão de teste no fixture. |
| Higiene de artefatos e ignore | `failed` | `git ls-files` encontrou 333 arquivos rastreados em `bin/` e `obj/`; o `.gitignore` raiz não contém regras específicas para essas saídas. Nenhum arquivo foi removido nem regra foi alterada. |
| Configuração de ferramentas de formatação/lint | `passed` | `.prettierignore` existe; `eslint.config.js` contém ignores para `node_modules`, `dist`, `build`, `coverage` e arquivos minificados. O repositório é Git; não há Dockerfile, publicação npm, Terraform ou chart Helm identificados. |
| Verificação de whitespace | `passed` | `git diff --check` não reportou erro de whitespace. Em arquivos preexistentes fora do backend, Git emitiu avisos de conversão LF/CRLF. |

## Achados

### F-001 — Rotas sem autorização ou verificação de propriedade

- **Severidade**: `critical`
- **Categoria**: Autorização e controle de acesso.
- **Confirmação**: Defeito confirmado no código; exposição em ambiente publicado não verificada.
- **Prioridade**: `P1`

O pipeline configura autenticação e autorização, mas nenhuma ação dos controllers tem `[Authorize]` e não há política global de fallback configurada. Por exemplo, `GetProfile` recebe um `userId` arbitrário pela query string. A mesma ausência de autorização/propriedade aparece nos fluxos de chat, vagas e turnos, que recebem IDs do cliente. O CORS também permite qualquer origem, o que aumenta a exposição a clientes de navegador, mas não substitui nem concede autorização.

**Impacto**: Se a API estiver acessível, usuários não autenticados podem consultar dados pessoais ou acionar operações de outros usuários/estabelecimentos.

**Evidência**: [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs#L81), [AuthController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/AuthController.cs#L122), [ChatController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ChatController.cs#L21), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L21), [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L26), [GigsController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/GigsController.cs#L71).

**Ação recomendada**: Exigir autenticação por padrão, declarar permissões por papel e validar propriedade do recurso no servidor. Derivar a identidade do token validado, em vez de confiar em IDs fornecidos pelo cliente. Adicionar testes para requisições anônimas e acesso cruzado entre usuários.

**Verificação segura**: Em testes de integração com banco descartável, confirmar que chamadas sem token são recusadas e que um usuário autenticado não consegue consultar ou alterar recursos de outro.

### F-002 — Resposta de vaga pode serializar hash de senha e dados pessoais

- **Severidade**: `critical`
- **Categoria**: Exposição de dados pessoais.
- **Confirmação**: Defeito confirmado por inspeção do grafo retornado.
- **Prioridade**: `P1`

`GetGigById` inclui as candidaturas e o objeto `Freelancer`, depois retorna a entidade EF diretamente. A entidade `User` tem `PasswordHash` e outros dados pessoais em propriedades públicas. A configuração para ignorar ciclos não restringe as propriedades serializadas.

**Impacto**: A resposta pode expor hashes de senha e dados pessoais dos candidatos a qualquer consumidor da rota. O responsável confirmou que as contas e senhas usadas no seed/testes são fictícias; ainda assim, o endpoint serializa o mesmo tipo de entidade que pode conter dados reais.

**Evidência**: [GigsController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/GigsController.cs#L76), [GigsController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/GigsController.cs#L82), [Entities.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Models/Entities.cs#L15).

**Ação recomendada**: Retornar um DTO explicitamente limitado aos campos necessários, sem serializar entidades EF nem incluir dados de autenticação. Criar teste de contrato que verifique a ausência de hashes e campos pessoais não autorizados na resposta.

**Verificação segura**: Com um registro sintético em banco descartável, validar o JSON serializado e assegurar que não contenha propriedades de autenticação nem dados pessoais fora do contrato.

### F-003 — Segredos de fallback embutidos no backend

- **Severidade**: `high`
- **Categoria**: Gerenciamento de segredos e configuração.
- **Confirmação**: Fallbacks confirmados no código; o responsável informa uso apenas local, mas o ambiente de implantação não foi inspecionado.
- **Prioridade**: `P1`

O backend usa valores de fallback embutidos para a conexão do banco e a chave JWT quando a configuração está ausente. A chave de assinatura também tem fallback no serviço de tokens. O arquivo `appsettings.json` contém configurações de conexão e JWT; os valores foram mantidos fora deste relatório.

**Impacto**: Embora o responsável informe que os valores são usados apenas localmente, uma implantação sem configuração completa ainda pode recorrer aos fallbacks embutidos, comprometendo a confiança dos tokens e o acesso ao banco.

**Evidência**: [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs#L11), [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs#L39), [TokenService.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Services/TokenService.cs#L25), [appsettings.json](../../apps/server-dotnet/src/TrampoTaxa.Api/appsettings.json).

**Ação recomendada**: Falhar na inicialização quando segredos obrigatórios estiverem ausentes; remover defaults sensíveis do código e proteger configurações por mecanismo de segredos apropriado. Avaliar rotação de qualquer valor que tenha sido compartilhado ou usado em ambiente real.

**Verificação segura**: Em ambiente local isolado, iniciar a aplicação sem os valores obrigatórios e confirmar que ela falha de forma explícita, sem aceitar os fallbacks.

### F-004 — Código de presença fixo e revelado pela resposta de erro

- **Severidade**: `high`
- **Categoria**: Integridade do check-in.
- **Confirmação**: Defeito confirmado no fluxo.
- **Prioridade**: `P1`

O código mestre é fixo no controller e também há um valor padrão fixo na entidade. A resposta de erro do check-in retorna uma dica com o valor esperado.

**Impacto**: A validação deixa de demonstrar presença física no estabelecimento e não distingue um código válido de um valor amplamente conhecido.

**Evidência**: [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L15), [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L101), [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L106), [Entities.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Models/Entities.cs#L71).

**Ação recomendada**: Substituir o valor compartilhado por códigos imprevisíveis, vinculados ao turno e com validade limitada; não revelar o valor esperado em respostas.

**Verificação segura**: Em teste isolado, confirmar que código expirado/reutilizado seja recusado e que respostas de erro não revelem o código válido.

### F-005 — Transições de turno sem validação de estado, prazo ou idempotência

- **Severidade**: `high`
- **Categoria**: Integridade de estado e fluxo de negócio.
- **Confirmação**: Defeito confirmado por inspeção; efeito em produção não testado.
- **Prioridade**: `P1`

`ApproveShift` avança o turno sem verificar a fase anterior e incrementa a contagem de trabalhos concluídos em cada chamada. `ContestShift` muda a fase sem validar que o turno está em revisão nem que o prazo de contestação está aberto.

**Impacto**: Operações repetidas ou fora de ordem podem produzir estado inconsistente, contagens incorretas e registros indevidos de aprovação/contestação.

**Evidência**: [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L114), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L123), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L130), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L163), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L168).

**Ação recomendada**: Definir transições permitidas, validar papel e propriedade, validar a janela de contestação e tornar operações repetidas seguras/idempotentes.

**Verificação segura**: Com banco descartável, testar aprovações repetidas, transições fora de ordem e contestações após o prazo; confirmar que o estado e os contadores não sejam alterados indevidamente.

### F-006 — Limite de candidaturas suscetível a concorrência

- **Severidade**: `medium`
- **Categoria**: Concorrência e regra de negócio.
- **Confirmação**: Risco não reproduzido por falta de SDK.
- **Prioridade**: `P2`

`Apply` consulta a quantidade de candidaturas ativas e depois insere uma nova candidatura em operações distintas. O modelo não define uma restrição que imponha atomicamente o limite de três.

**Impacto**: Requisições concorrentes podem observar a mesma contagem e ultrapassar o limite pretendido.

**Evidência**: [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L55), [FreelancerController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/FreelancerController.cs#L76), [AppDbContext.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Data/AppDbContext.cs).

**Ação recomendada**: Tornar a verificação/inserção atômica no domínio e persistência e cobrir o limite com teste concorrente usando banco de teste isolado.

**Verificação segura**: Em teste concorrente com banco descartável, enviar candidaturas simultâneas e validar que o limite continue respeitado.

### F-007 — Validação de regras de negócio insuficiente na criação de vagas

- **Severidade**: `medium`
- **Categoria**: Validação de entrada e integridade de dados.
- **Confirmação**: Defeito confirmado por inspeção; cenários não executados.
- **Prioridade**: `P2`

O DTO de criação não define limites para valores monetários, quantidade de vagas ou ordem dos horários, e o controller persiste esses valores sem validação de domínio explícita.

**Impacto**: Dados inconsistentes, como horários invertidos, valores inválidos ou quantidade de vagas fora do esperado, podem ser aceitos.

**Evidência**: [Dtos.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/DTOs/Dtos.cs#L72), [Dtos.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/DTOs/Dtos.cs#L77), [ContractorController.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Controllers/ContractorController.cs#L21).

**Ação recomendada**: Definir e validar limites de domínio antes de persistir, com respostas consistentes para dados inválidos.

**Verificação segura**: Em teste local, enviar valores e intervalos fora dos limites documentados e confirmar a rejeição antes da persistência.

### F-008 — Testes de integração podem contaminar banco compartilhado

- **Severidade**: `medium`
- **Categoria**: Isolamento e confiabilidade dos testes.
- **Confirmação**: Risco confirmado na configuração dos testes.
- **Prioridade**: `P2`

O host da API cria/verifica o banco e executa seed na inicialização. O fixture de testes usa `WebApplicationFactory<Program>` sem substituir a conexão; os testes gravam usuários, vagas, candidaturas e turnos sem limpeza correspondente.

**Impacto**: Testes podem gravar no banco configurado por ambiente, acumular dados e tornar execuções repetidas dependentes do estado anterior.

**Evidência**: [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs#L70), [DbInitializer.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Data/DbInitializer.cs#L10), [IntegrationTests.cs](../../apps/server-dotnet/tests/TrampoTaxa.Api.Tests/IntegrationTests.cs#L13), [IntegrationTests.cs](../../apps/server-dotnet/tests/TrampoTaxa.Api.Tests/IntegrationTests.cs#L97).

**Ação recomendada**: Configurar um banco descartável exclusivo no fixture de testes e limpar/isolá-lo por execução. Não executar a suíte contra o banco padrão ou compartilhado.

**Verificação segura**: Após configurar o fixture isolado, executar a suíte duas vezes e confirmar que o banco padrão não recebe alterações e que os resultados não dependem de dados residuais.

### F-009 — Arquivo HTTP de desenvolvimento chama rota inexistente

- **Severidade**: `low`
- **Categoria**: Manutenção da verificação manual.
- **Confirmação**: Defeito confirmado por inspeção estática.
- **Prioridade**: `P3`

O arquivo de requisições de desenvolvimento chama `GET /weatherforecast/`, mas o pipeline mapeia apenas `/` e os controllers; não há endpoint `weatherforecast`.

**Impacto**: A requisição de smoke test fornecida no repositório não valida a API e retorna 404.

**Evidência**: [TrampoTaxa.Api.http](../../apps/server-dotnet/src/TrampoTaxa.Api/TrampoTaxa.Api.http), [Program.cs](../../apps/server-dotnet/src/TrampoTaxa.Api/Program.cs#L79).

**Ação recomendada**: Atualizar o arquivo HTTP para uma rota existente e mantida como smoke check.

**Verificação segura**: Executar a requisição localmente após iniciar a API e confirmar resposta de sucesso.

## Cobertura de testes revisada

Os testes existentes cobrem o endpoint de saúde, login de usuários semeados, o limite sequencial de candidaturas, check-in com código inválido/válido e o fluxo de checkout/aprovação. A cobertura não verifica acesso anônimo/propriedade, campos sensíveis serializados, concorrência no limite, aprovações repetidas, contestação fora do prazo ou validação de limites do DTO. A suíte não foi executada pelas limitações descritas acima.

## Proposta de limpeza (aprovação pendente)

O inventário Git identificou **333 arquivos rastreados** de build: **293 em `bin/`** e **40 em `obj/`**. Foram agrupados nos seguintes caminhos:

| Caminho candidato | Estado Git | Classificação | Uso/referências | Regeneração | Disposição | Aprovação |
|---|---|---|---|---|---|---|
| `apps/server-dotnet/src/TrampoTaxa.Api/bin/` | 26 rastreados | Saída .NET (`bin/Debug/net8.0`) | Nenhuma referência em código/testes revisados; contém cópias geradas de configuração, cujas fontes permanecem no projeto | Não verificada: SDK ausente | `needs-review` | `pending` |
| `apps/server-dotnet/src/TrampoTaxa.Api/obj/` | 27 rastreados | Saída intermediária MSBuild/NuGet | Nenhuma referência em código/testes revisados; metadados gerados incluem caminhos de saída | Não verificada: SDK ausente | `needs-review` | `pending` |
| `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/bin/` | 267 rastreados | Saída .NET (`bin/Debug/net8.0`) | Nenhuma referência em código/testes revisados; contém cópias geradas de configuração, cujas fontes permanecem no projeto | Não verificada: SDK ausente | `needs-review` | `pending` |
| `apps/server-dotnet/tests/TrampoTaxa.Api.Tests/obj/` | 13 rastreados | Saída intermediária MSBuild/NuGet | Nenhuma referência em código/testes revisados; metadados gerados incluem caminhos de saída | Não verificada: SDK ausente | `needs-review` | `pending` |
| **Total** | **333 rastreados** | **Candidatos de build** | **Busca limitada a código e testes revisados** | **Não verificada** | **Aprovação pendente** | **`pending`** |

O `.gitignore` atual não contém padrões para essas saídas .NET. Após confirmação de regeneração e aprovação explícita, a proposta é adicionar apenas:

```gitignore
apps/server-dotnet/**/bin/
apps/server-dotnet/**/obj/
```

Não se recomenda ignorar genericamente `packages/`: esse caminho contém código-fonte do monorepo. Nenhum arquivo, regra de ignore ou configuração foi alterado nesta avaliação.

## Limitações e estado do ambiente

- Nenhum .NET SDK está disponível; build e testes não puderam ser executados.
- Não foi confirmada uma conexão de banco descartável; os testes foram bloqueados para evitar escrita em banco compartilhado.
- A linha de base de desempenho/carga solicitada permanece bloqueada até haver .NET SDK, k6 e ambiente local descartável com banco/API isolados. O harness GET-only foi criado em `apps/server-dotnet/tests/performance/baseline.js`; o perfil planejado é 10 VUs por 30 segundos.
- Referências em ferramentas externas ao repositório, ambientes de deploy ou automações não foram verificadas.
- A configuração efetivamente usada em produção e a exposição pública do serviço não foram verificadas independentemente; o responsável informa que os valores de conexão/JWT são apenas locais.
- O responsável confirmou que as contas/senhas de seed e teste são fictícias; essas informações não foram verificadas independentemente.
- Nenhum teste de carga, intrusão ou consulta a dados de produção foi realizado.
- Para preparar a linha de base prevista em FR-011, foi adicionado apenas o harness de teste `apps/server-dotnet/tests/performance/baseline.js`; nenhum código de produção, configuração de runtime ou dado foi alterado.
- O diretório `apps/server-dotnet` estava limpo no início da avaliação. Alterações preexistentes fora dele (`.specify/feature.json`, `apps/mobile/app.json`, `apps/web/dev-dist/sw.js`, `bun.lock` e `apps/mobile/.expo/settings.json`) foram preservadas.
- A chave e os valores de conexão encontrados nos arquivos não foram reproduzidos neste relatório.

## Próximas ações prioritárias

1. Corrigir autorização e validação de propriedade em todas as rotas; confirmar a exposição do serviço antes de qualquer implantação.
2. Substituir respostas de entidades por DTOs seguros e validar que hashes e dados pessoais não sejam serializados.
3. Remover fallbacks sensíveis e assegurar configuração de segredos fail-closed; avaliar rotação dos valores existentes.
4. Corrigir o fluxo de presença e as transições de turno, com validação de estado, prazo e idempotência.
5. Disponibilizar .NET 8 SDK, banco de teste descartável e ambiente isolado de carga; definir o perfil de carga e executar build, testes e linha de base.
6. Após revisão e aprovação separadas, confirmar a regeneração dos artefatos `bin/`/`obj/`, aplicar ignore específico e remover do Git apenas as saídas aprovadas.

## Estado das alterações

Esta avaliação não alterou código, configuração, artefatos de build ou dados do backend. A única entrega desta execução é este relatório; a limpeza permanece pendente de validação de regeneração e aprovação.

`git diff --check` terminou com código de saída 0; Git emitiu apenas avisos LF/CRLF nos arquivos preexistentes `apps/web/dev-dist/sw.js` e `bun.lock`. A consulta final `git status --short --untracked-files=all -- apps/server-dotnet` não retornou alterações. Os arquivos preexistentes fora do backend e os documentos Spec Kit foram preservados.
