# single-device-mvp-qa-gate Specification

## Purpose
TBD - created by archiving change add-single-device-mvp-qa-gate. Update Purpose after archive.
## Requirements
### Requirement: Single-device MVP exposes a QA gate command

The project SHALL provide a documented command entry point for verifying the
single-device MVP baseline.

#### Scenario: QA gate command is discoverable

- **WHEN** a developer reads the project command list
- **THEN** the project SHALL document a single-device MVP QA command such as
  `pnpm check:qa`
- **AND** the command SHALL be available from `package.json` or an equivalent
  documented wrapper

#### Scenario: QA gate exits non-zero on failure

- **WHEN** any required QA sub-check fails
- **THEN** the QA gate SHALL exit with a non-zero status
- **AND** it SHALL NOT silently ignore the failed sub-check

#### Scenario: Lower-level checks remain available

- **WHEN** the QA gate is added
- **THEN** existing focused commands such as `pnpm check:type`,
  `pnpm check:local`, `pnpm test`, `pnpm skin:qa:remote`, and `pnpm thumbs`
  SHALL remain available

### Requirement: QA gate covers deterministic MVP checks

The QA gate SHALL cover the deterministic checks needed before entering manual
or automated frontend QA for the single-device MVP.

#### Scenario: Type and locale checks are included

- **WHEN** the QA gate runs
- **THEN** it SHALL run the TypeScript check
- **AND** it SHALL run locale alignment validation

#### Scenario: Core local workflow tests are included

- **WHEN** the QA gate runs
- **THEN** it SHALL run Jest coverage for local trust data behavior
- **AND** it SHALL run Jest coverage for onboarding or welcome behavior
- **AND** it SHALL run Jest coverage for item workflows
- **AND** it SHALL run Jest coverage for helper/contact workflows
- **AND** it SHALL run Jest coverage for trigger-state simulation
- **AND** it SHALL run Jest coverage for home readiness summary
- **AND** it SHALL run Jest coverage for my/settings and backup behavior

#### Scenario: Skin runtime QA is included

- **WHEN** the QA gate runs
- **THEN** it SHALL run skin runtime or remote skin download QA coverage
- **AND** the QA coverage SHALL remain local fixture and dependency-injection
  based

#### Scenario: OpenSpec strict validation is included

- **WHEN** the QA gate runs
- **THEN** it SHALL run full OpenSpec strict validation for the repository

### Requirement: Runtime screenshots use the real app bundle

The MVP QA workflow SHALL preserve real runtime screenshot coverage and SHALL
NOT replace it with generated design previews.

#### Scenario: Screenshot command renders Expo Web output

- **WHEN** runtime screenshots are generated
- **THEN** the workflow SHALL use the existing Expo Web bundle screenshot path
- **AND** it SHALL render real app pages through Playwright or the configured
  browser path

#### Scenario: Screenshot failures are explicit

- **WHEN** the runtime browser or Expo Web export path is unavailable
- **THEN** the screenshot command SHALL fail or report the environment failure
  explicitly
- **AND** it SHALL NOT fall back to `pnpm design` or generated preview images

#### Scenario: Screenshot gate is documented if split

- **WHEN** runtime screenshots are slower or more environment-sensitive than the
  deterministic QA gate
- **THEN** the project MAY expose them as a separate documented QA subcommand
- **AND** the docs SHALL state that it is required before frontend visual QA

### Requirement: QA workflow documents frontend bug reporting

The project SHALL define a durable convention for recording frontend QA
findings.

#### Scenario: Bug report location is documented

- **WHEN** a frontend QA issue is found
- **THEN** the workflow SHALL direct the reporter to create a Markdown file
  under `.bugs/`

#### Scenario: Bug report includes actionable fields

- **WHEN** a `.bugs/*.md` report is created
- **THEN** it SHALL include a problem description
- **AND** it SHALL include reproduction or observed path information
- **AND** it SHALL include suspected location
- **AND** it SHALL include suggested fix direction
- **AND** it SHALL include a verification command or manual check to rerun

### Requirement: QA gate is documented for handoff and local use

The project SHALL document the QA gate for local development and cross-machine
handoff.

#### Scenario: README explains the QA command

- **WHEN** a developer reads `README.md`
- **THEN** it SHALL list the single-device MVP QA command
- **AND** it SHALL summarize what the command covers

#### Scenario: Agent instructions include the QA command

- **WHEN** an AI agent reads `AGENTS.md`
- **THEN** it SHALL see the QA gate command in common commands or validation
  guidance

#### Scenario: Handoff notes point to the QA gate

- **WHEN** `TODO.md` is updated after this change
- **THEN** it SHALL point the next local MVP step to running or using the QA
  gate rather than reconstructing previous command history

### Requirement: QA gate remains local-only

The QA gate SHALL verify the standalone MVP without introducing connected-app
dependencies.

#### Scenario: No backend dependency is introduced

- **WHEN** the QA gate is implemented
- **THEN** it SHALL NOT require backend accounts
- **AND** it SHALL NOT require cloud sync
- **AND** it SHALL NOT require push notification providers
- **AND** it SHALL NOT require SMS or email providers
- **AND** it SHALL NOT require remote product-data services

#### Scenario: Product behavior is not changed by the gate

- **WHEN** the QA gate is implemented
- **THEN** it SHALL NOT change onboarding, item CRUD, helper/contact CRUD,
  trigger simulation, readiness summary, backup export/import, or skin runtime
  product behavior except where documentation or test orchestration explicitly
  requires
