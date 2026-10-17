# Feature Specification: Engineering Foundation

**Feature Branch**: `001-engineering-foundation`

**Created**: 2026-10-15

**Status**: Draft

**Input**: User description: "o projeto foi criado com Vibecoder criando um desenvolvimento em caos, preciso de uma infrestrutura robusta, segura, bem estruturada, com um fluxo bem definidos e um sistema maduro"

## Clarifications

### Session 2026-10-15

- Q: Esta refatoração deve substituir o escopo amplo da especificação atual por uma especificação focada nos quatro problemas do monorepo — nomes/saídas do Orval, exports dos mocks, localização do contrato/configuração OpenAPI e autenticação JWT no Mobile? → A: Manter a especificação atual e abrir uma feature separada para a refatoração.
- Q: Como devo tratar o conflito entre os requisitos funcionais de autenticação desta feature e a decisão de reservar o contexto JWT do Mobile para uma feature separada? → A: Manter esta feature apenas em fluxo/governança; mover autenticação funcional para feature separada.
- Q: Como devemos verificar o limite de débito técnico abaixo de 10% quando o repositório hoje tem ESLint, mas não mostra configuração nem relatório automatizado do SonarLint? → A: Exigir análise Sonar automatizada no CI para medir o débito, além do ESLint.
- Q: Como o ESLint não calcula por si só uma taxa de débito técnico, devemos aplicar o limite de 10% ao indicador do Sonar e exigir que o ESLint não tenha erros? → A: Aplicar o limite de débito técnico ao indicador Sonar e exigir zero erros no ESLint.

### Session 2026-10-17

- Q: Com a sessão Mobile e as rotas protegidas agora presentes, quais riscos de autenticação devem continuar bloqueando um release de produção? → A: Fechar apenas a ausência de contexto/roteamento no Mobile; manter os riscos Web e de autorização no servidor como abertos.
- Q: Para que as mudanças em `packages/shared` — incluindo o contrato OpenAPI e a configuração do Orval — não escapem das verificações, a validação obrigatória deve rodar em todo pull request ou somente nas áreas alteradas? → A: Executar validação completa em todo pull request para Web, Mobile e shared, incluindo geração e verificação OpenAPI/Orval.
- Q: Para o monorepo com `apps/web`, `apps/mobile` e `packages/shared`, devemos usar um único template padrão de pull request com seleção das áreas afetadas e evidências de testes/segurança? → A: Usar um único template padrão central, com seleção de áreas afetadas e campos comuns de validação e segurança.
- Q: O contrato canônico deve existir apenas em `packages/shared/openapi.yaml`, atualizando referências antigas e removendo `docs/openapi.yaml`, que ainda está no repositório e difere do contrato compartilhado? → A: Manter uma única fonte canônica em `packages/shared/openapi.yaml`, corrigir referências antigas e remover a cópia divergente em `docs/openapi.yaml`.
- Q: O Mobile já tem contexto de sessão, armazenamento seguro e navegação protegida, mas o código revisado não mostra uma tela/fluxo que obtenha o JWT nem um emissor/API de autenticação; devemos considerar resolvida apenas a infraestrutura local e manter autenticação ponta a ponta como risco aberto? → A: Marcar a infraestrutura local de sessão/rotas como entregue, mas manter a integração de login/token e a autorização no servidor como riscos abertos até teste ponta a ponta.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Deliver Changes Through a Predictable Workflow (Priority: P1)

As a contributor, I need a clear and repeatable path from a proposed change to an
approved release so that I can make changes without relying on undocumented practices
or accidentally bypassing essential checks.

**Why this priority**: Uncontrolled change is the central problem described. A
consistent workflow is the foundation for improving quality and reducing regressions.

**Independent Test**: A contributor can follow the published workflow for a sample
change, identify every required review and verification step, and determine whether
the change is ready to merge and release.

**Acceptance Scenarios**:

1. **Given** a contributor is preparing a change, **When** they consult the project
   workflow, **Then** they can identify the required preparation, review, verification,
   and release stages without relying on private instructions.
2. **Given** required verification for a change has failed, **When** the change is
   evaluated for approval or release, **Then** it is clearly identified as blocked and
   cannot be treated as ready.
3. **Given** two contributors follow the workflow for equivalent changes, **When**
   they complete the required stages, **Then** both changes are evaluated against the
   same documented criteria.
4. **Given** a change affects more than one application area, **When** it is submitted
   for review, **Then** every affected area and its verification evidence are identified.
5. **Given** any pull request changes the repository, **When** required validation runs,
   **Then** it checks Web, Mobile, shared code, and generated API artifacts from the
   canonical shared contract regardless of changed paths.
6. **Given** a contributor opens a pull request, **When** the repository template is
   presented, **Then** one standard template asks for affected areas, verification
   evidence, security/data impact, and related risk records.
7. **Given** a contributor locates the API contract, **When** they consult project
   documentation or run API generation, **Then** all references resolve to
   `packages/shared/openapi.yaml` and no divergent root copy is presented as canonical.

---

### User Story 2 - Review Security Risks Before Release (Priority: P1)

As a project maintainer, I need security expectations and known access-control gaps
reviewed before release so that user data, privileged actions, and project assets are
not exposed by accidental or unauthorized changes.

**Why this priority**: Security is a prerequisite for a mature system, not an optional
polish step. The existing project governance requires authenticated access, role-based
permissions, and first-access handling.

**Independent Test**: Review a representative change and release against the documented
security checklist, confirming that access-control gaps are recorded, assigned, and
handled according to the release gate.

**Acceptance Scenarios**:

1. **Given** a change could affect authentication, authorization, or sensitive data,
   **When** it is reviewed, **Then** its security impact and required verification are
   documented before approval.
2. **Given** an application error occurs while handling sensitive configuration,
   **When** the error is shown to a user, **Then** the sensitive value is not included.
3. **Given** a critical or high-severity security risk is found, **When** a production
   release is evaluated, **Then** the risk has a documented owner and disposition.
4. **Given** an authentication or server-side authorization gap remains, including the
   Web mock login or Mobile login/token integration not verified end to end, **When**
   a production release is evaluated, **Then** the gap remains an open security risk
   and is handled by the release gate rather than being counted as a completed
   application control.
5. **Given** the Mobile session provider restores or clears session state and gates
   protected navigation, **When** its implemented checks are reviewed, **Then** the
   former absence-of-session-context risk is marked resolved without asserting that
   token issuance or server-side authorization has been verified.

---

### User Story 3 - Understand and Improve System Health (Priority: P2)

As a maintainer, I need a visible baseline for quality, system ownership, and known
risks so that I can prioritize remediation and keep the project maintainable as it
grows.

**Why this priority**: Once safe change and release practices exist, maintainers need
reliable evidence to identify weak areas and prevent technical debt from accumulating.

**Independent Test**: A maintainer can locate the current quality and risk indicators,
identify the owner of each major project area, and create a prioritized improvement
action for any failing indicator.

**Acceptance Scenarios**:

1. **Given** a maintainer is assessing project health, **When** they review the
   documented baseline, **Then** they can distinguish passing measures, failing
   measures, and work required to address each failure.
2. **Given** a project area has no documented owner or maintenance responsibility,
   **When** the project structure is reviewed, **Then** the ownership gap is visible
   and assigned for resolution.
3. **Given** a quality measure exceeds its required limit, **When** a release is
   evaluated, **Then** the release is blocked until the measure is restored or an
   approved exception is recorded.
4. **Given** a defect or security risk is recorded, **When** maintainers review the
   project backlog, **Then** its priority, owner, status, and verification of resolution
   can be determined.

### Edge Cases

- Required verification tools or services are unavailable: the change remains blocked
  rather than being treated as passing.
- A change is an urgent security fix: it may use an expedited review path, but
  authentication, authorization, and essential verification requirements remain in
  force and any skipped nonessential step is documented for follow-up.
- A change spans Web, Mobile, and shared behavior: the review identifies and verifies
  each affected platform and shared contract.
- A contributor cannot determine which requirements apply: the workflow directs them
  to a named maintainer or documented escalation path before merge.
- A quality measure has no available baseline: the project records a baseline before
  declaring the relevant quality gate satisfied.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The project MUST provide a single, discoverable workflow describing how
  work is proposed, reviewed, verified, approved, and released.
- **FR-002**: The workflow MUST identify required checks and MUST prevent a change
  with failed or missing required checks from being treated as approved for release.
- **FR-003**: The project MUST define ownership and maintenance responsibility for
  each major application and shared project area.
- **FR-004**: The project MUST document security review expectations for changes
  affecting identity, access permissions, user data, or privileged operations.
- **FR-005**: The project MUST require security reviews to identify whether protected
  capabilities enforce role-based authorization at the point of action; interface
  visibility alone MUST NOT be accepted as authorization evidence.
- **FR-006**: The project MUST track unresolved Web authentication, Mobile
  end-to-end login/token integration, and server-side authorization gaps as security
  risks until their controls are implemented and verified. The delivered Mobile
  session context and protected navigation MUST NOT be listed as missing or treated
  as proof that token issuance or server-side authorization is complete.
- **FR-007**: The project MUST define how credentials and sensitive configuration are
  handled so they are not committed to source history or exposed in user-facing
  errors.
- **FR-008**: The project MUST define quality indicators, their measurement cadence,
  and an accountable owner for each indicator, including automated Sonar analysis in
  continuous integration.
- **FR-009**: The technical-debt ratio reported by automated Sonar analysis MUST
  remain strictly below 10%; a value at or above 10% MUST block release until
  corrected or covered by a documented, approved exception. ESLint MUST report zero
  errors for release approval.
- **FR-010**: Every production release MUST require successful automated checks,
  including the applicable automated tests, before deployment.
- **FR-011**: The project MUST provide a documented process for recording, prioritizing,
  assigning, and verifying remediation of defects and security risks.
- **FR-012**: The project MUST define an expedited path for urgent security fixes that
  records the reason, reviewer, verification performed, and any required follow-up.
- **FR-013**: Changes affecting multiple application platforms or shared behavior MUST
  identify the affected areas and include verification evidence for each affected area.
- **FR-014**: Project structure and contribution guidance MUST make the supported
  application boundaries and shared responsibilities discoverable to contributors.
- **FR-015**: Every pull request MUST run required validation for Web, Mobile, and
  `packages/shared`, including API client generation from the shared OpenAPI contract;
  generated artifacts MUST be confirmed current and any uncommitted generation
  difference MUST fail the check.
- **FR-016**: The repository MUST provide one standard pull-request template that
  identifies `apps/web`, `apps/mobile`, `packages/shared` (including API contract and
  generated client), and workflow/documentation changes as affected-area choices, and
  requests verification evidence and security/data impact.
- **FR-017**: `packages/shared/openapi.yaml` MUST be the single canonical API contract.
  Project documentation MUST point to that path, and the divergent `docs/openapi.yaml`
  copy MUST be removed so API generation and contributor guidance cannot select
  different contracts.

### Key Entities *(include if feature involves data)*

- **Change**: A proposed modification with an author, affected areas, review status,
  verification evidence, and release state.
- **Quality Indicator**: A measurable project health or quality signal with a
  definition, threshold, measurement cadence, and accountable owner.
- **Security Risk**: A finding with severity, affected area, remediation owner, status,
  and verification evidence.
- **Release**: An approved delivery of a change set with associated checks, approvers,
  and deployment outcome.
- **Project Area**: A maintained part of the application or shared project with
  documented boundaries and an accountable owner.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of production releases have recorded evidence that required checks
  passed before deployment.
- **SC-002**: 100% of reviewed release candidates record the status and disposition
  of unresolved Web authentication, Mobile end-to-end login/token integration, and
  server-side authorization gaps; the delivered Mobile session-context control is not
  reported as missing.
- **SC-003**: At least 90% of contributors in a task-based workflow evaluation can
  identify the required steps and release readiness of a sample change without
  assistance.
- **SC-004**: 100% of major application and shared project areas have a documented
  maintenance owner.
- **SC-005**: The Sonar technical-debt ratio is below 10% and ESLint reports zero
  errors at release review; every exception is documented and approved before release.
- **SC-006**: 100% of critical and high-severity security findings have an owner and
  documented disposition before a production release.
- **SC-007**: 100% of pull requests run the complete required workspace validation,
  including shared API generation, and cannot pass when generated artifacts are stale.
- **SC-008**: 100% of pull requests use the standard template to record affected areas,
  verification evidence, and security/data impact.
- **SC-009**: All maintained project documentation identifies
  `packages/shared/openapi.yaml` as the API contract, and no second divergent
  `openapi.yaml` file remains at the repository root.

## Assumptions

- The request concerns the repository's engineering and delivery foundation, rather
  than provisioning a new cloud infrastructure topology.
- The effort applies across the existing Web, Mobile, and shared project areas, while
  preserving the platform boundaries and security governance already established for
  the project.
- Existing project accounts and role definitions will be retained unless later
  discovery demonstrates that they cannot meet the documented access requirements.
- Maintainers can designate project-area owners and approve documented, time-bounded
  exceptions.
- Existing automated test and quality mechanisms can be incorporated into the delivery
  workflow; tool-specific implementation decisions belong to planning.

## Out of Scope

- New end-user product capabilities unrelated to project security, structure, or
  delivery maturity.
- Selecting or provisioning cloud infrastructure, hosting providers, or a new
  deployment topology.
- Replacing product identity providers or redefining business roles without a separate
  requirements decision.
- Refactoring Orval-generated package paths, mock exports, or OpenAPI/configuration
  ownership; those code changes were delivered under the separate architecture
  refactoring feature. The Mobile session context and protected navigation were also
  delivered separately and are treated as existing controls, not work in this feature;
  end-to-end login/token integration and server-side authorization remain open risks
  until separately implemented and verified.
- Resolving every pre-existing defect as part of the foundational workflow itself;
  the workflow will make those defects visible, prioritized, and trackable.
