# Feature Specification: Separação de acessos por perfil

**Feature Branch**: `[004-separar-acessos-perfis]`

**Created**: 2026-10-17

**Status**: Draft

**Input**: User description: "separa telas de acesso de contratante com freelancer, pois quando entro como freelancer saio e realizo login com contratante a tela de freelancer com mapa ainda continua aparecendo gerando uma má experiencia"

## Clarifications

### Session 2026-10-17

- Q: Uma mesma conta pode ter os perfis de contratante e freelancer, ou cada conta deve ter apenas um perfil? → A: Cada conta tem um único perfil; para usar o outro perfil, a pessoa encerra a sessão e entra com outra conta.
- Q: No app Mobile, você quer incluir também acesso e telas próprias para contratantes, além de freelancers? → A: Sim; incluir acesso e experiências de contratante e freelancer no Mobile, além de corrigir a troca de sessão.
- Q: Quais recursos de contratante devem estar disponíveis no Mobile nesta mudança? → A: Adaptar para Mobile as telas Web de vagas, criação, relatórios e chat de contratante.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar com o perfil correto após trocar de conta (Priority: P1)

Uma pessoa que encerrou uma sessão de freelancer e entrou em seguida como contratante vê somente a experiência de contratante. A tela e os dados do mapa do perfil anterior não permanecem visíveis após a troca.

**Why this priority**: A tela de freelancer após o login como contratante é o problema relatado e confunde a pessoa sobre qual conta está ativa.

**Independent Test**: Na Web e no Mobile, entrar como freelancer, confirmar a tela com mapa, encerrar a sessão e entrar como contratante. O fluxo passa se a experiência de contratante for apresentada e nenhum elemento exclusivo de freelancer permanecer visível.

**Acceptance Scenarios**:

1. **Given** uma sessão ativa de freelancer com o mapa visível na Web ou no Mobile, **When** a pessoa encerra a sessão e entra com uma conta de contratante, **Then** vê a experiência de contratante sem mapa, dados ou controles exclusivos de freelancer.
2. **Given** uma sessão ativa de contratante na Web ou no Mobile, **When** a pessoa encerra a sessão e entra com uma conta de freelancer, **Then** vê a experiência de freelancer e seus recursos próprios.
3. **Given** que a pessoa atualiza a Web ou reabre o app Mobile após entrar como contratante, **When** a sessão de contratante continua válida, **Then** a experiência exibida continua sendo a de contratante, sem restaurar a tela de freelancer anterior.

---

### User Story 2 - Acessar a tela do próprio perfil (Priority: P2)

Uma pessoa que procura acesso como contratante ou como freelancer encontra uma tela de acesso própria e identificada para esse perfil na Web e no Mobile. Após autenticar-se, recebe a experiência correspondente à conta utilizada na plataforma escolhida.

**Why this priority**: Telas próprias e identificadas reduzem enganos no acesso e deixam claro qual jornada será aberta antes e depois da autenticação.

**Independent Test**: Na Web e no Mobile, abrir o acesso destinado a cada perfil e autenticar uma conta de cada tipo; cada conta deve abrir apenas sua própria experiência.

**Acceptance Scenarios**:

1. **Given** que a pessoa precisa entrar como contratante na Web ou no Mobile, **When** abre o acesso de contratante, **Then** vê uma tela de acesso identificada para contratantes e não a tela de acesso exclusiva de freelancers.
2. **Given** que a pessoa precisa entrar como freelancer na Web ou no Mobile, **When** abre o acesso de freelancer, **Then** vê uma tela de acesso identificada para freelancers e não a tela de acesso exclusiva de contratantes.
3. **Given** uma tentativa de autenticação sem sucesso na Web ou no Mobile, **When** a aplicação mantém a pessoa na tela de acesso, **Then** não exibe conteúdo protegido ou específico de nenhum perfil.
4. **Given** uma conta de contratante autenticada no Mobile, **When** a pessoa navega pela área de contratante, **Then** consegue acessar vagas, criação de vaga, relatórios e chat sem entrar na navegação de freelancer.

### Edge Cases

- A pessoa encerra a sessão enquanto a tela de freelancer ou o mapa está aberto; a tela anterior e seus dados deixam de ser exibidos durante o retorno ao acesso.
- A sessão é encerrada e outra conta é usada antes de uma atualização completa da página; o novo perfil determina a experiência apresentada.
- A autenticação falha durante uma troca de conta; conteúdo de uma sessão anterior não deve ser apresentado como se pertencesse à tentativa atual.
- Uma pessoa acessa novamente a aplicação usando o histórico de navegação após trocar de perfil; a experiência deve continuar compatível com a sessão atualmente válida.
- No Mobile, uma sessão é restaurada após reabrir o app; a navegação inicial deve corresponder ao perfil da conta restaurada e não deve presumir que toda sessão é de freelancer.
- No Mobile, o perfil da conta não está disponível durante a restauração ou autenticação; nenhuma tela protegida específica de perfil deve ser exibida até que seja determinado.
- Se o perfil da conta não puder ser determinado, a aplicação não deve mostrar conteúdo exclusivo de freelancer ou contratante até que o acesso correspondente seja confirmado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: As versões Web e Mobile MUST oferecer telas de acesso distintas e identificadas para contratantes e freelancers.
- **FR-002**: Após uma autenticação bem-sucedida em qualquer plataforma, a aplicação MUST apresentar a experiência correspondente ao perfil da conta autenticada.
- **FR-003**: Ao encerrar uma sessão na Web ou no Mobile, a aplicação MUST deixar de exibir as telas e os dados exclusivos do perfil encerrado antes de apresentar o próximo acesso.
- **FR-004**: Ao entrar com um perfil diferente do perfil da sessão anterior, a Web e o Mobile MUST impedir que telas, dados ou controles exclusivos do perfil anterior permaneçam visíveis.
- **FR-005**: A Web e o Mobile MUST preservar a correspondência entre a sessão válida e a experiência exibida após atualização, reabertura ou retorno à aplicação.
- **FR-006**: Enquanto a autenticação ou a identificação do perfil não estiver confirmada, a Web e o Mobile MUST NOT exibir conteúdo protegido ou exclusivo de qualquer perfil.
- **FR-007**: Uma falha de autenticação na Web ou no Mobile MUST manter a pessoa na experiência de acesso sem apresentar a tela de freelancer ou de contratante como se a autenticação tivesse sido concluída.
- **FR-008**: O Mobile MUST oferecer navegação e telas próprias de contratante e de freelancer; uma sessão restaurada MUST apresentar somente a navegação compatível com o perfil da conta.
- **FR-009**: O Mobile MUST oferecer aos contratantes acesso às funções de vagas, criação de vaga, relatórios e chat disponíveis na experiência Web, apresentadas em navegação apropriada ao Mobile.

### Key Entities *(include if data involved)*

- **Conta autenticada**: Representa a conta que concluiu o acesso e o perfil associado que determina a experiência disponível.
- **Perfil de acesso**: Identifica se a conta atua como contratante ou freelancer e define a experiência e os recursos exclusivos a apresentar.
- **Experiência do perfil**: Conjunto de telas, dados e controles apresentados enquanto uma sessão válida corresponde a um perfil.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% dos testes de troca freelancer → contratante na Web e no Mobile, após autenticação válida, a experiência de contratante é apresentada sem mapa ou conteúdo exclusivo do freelancer.
- **SC-002**: Em 100% dos testes de troca contratante → freelancer na Web e no Mobile, após autenticação válida, a experiência de freelancer é apresentada sem conteúdo exclusivo do contratante.
- **SC-003**: Em 100% dos testes de atualização/reabertura, retorno pelo histórico ou falha de autenticação após troca de conta, tanto na Web quanto no Mobile, nenhum conteúdo exclusivo da sessão anterior é apresentado como pertencente à sessão atual.
- **SC-004**: Pelo menos 90% das pessoas participantes de um teste de usabilidade identificam corretamente o acesso destinado ao seu perfil antes de autenticar-se.
- **SC-005**: Em 100% dos testes da jornada de contratante no Mobile, as pessoas conseguem abrir vagas, criação de vaga, relatórios e chat sem visualizar conteúdo exclusivo de freelancer.

## Assumptions

- Contratante e freelancer são perfis distintos de conta, com experiências e recursos próprios.
- Cada plataforma mantém seu mecanismo de autenticação existente; uma conta autenticada em cada plataforma tem um único perfil, que determina as telas e recursos apresentados.
- Cada conta possui apenas um perfil: contratante ou freelancer. Para usar o outro perfil, a pessoa encerra a sessão e entra com uma conta diferente; alternar perfis dentro da mesma conta não faz parte do escopo.
- As versões Web e Mobile oferecem acesso e experiência para ambos os perfis; cada plataforma mantém sua navegação e apresentação próprias, mas aplica as mesmas regras de separação e troca de sessão.
- Conteúdo exclusivo do perfil anterior não pode ser mostrado enquanto o perfil da sessão atual não estiver confirmado.
