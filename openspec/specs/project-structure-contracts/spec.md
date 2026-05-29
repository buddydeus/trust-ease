# project-structure-contracts Specification

## Purpose
TBD - created by archiving change normalize-project-structure-contracts. Update Purpose after archive.
## Requirements
### Requirement: Active source boundaries are explicit

The repository SHALL define `src/app`, `src/pages`, `src/store`, and `src/skin`
as the active top-level implementation boundaries for routes, screens, runtime
state helpers, and skin runtime logic.

#### Scenario: Repository guidance names active source boundaries

- **WHEN** a developer reads root project guidance
- **THEN** it SHALL describe `src/app` as route wrappers
- **AND** it SHALL describe `src/pages` as screen-level UI
- **AND** it SHALL describe `src/store` as app state and side-effect helper
  aggregation
- **AND** it SHALL describe `src/skin` as skin package and runtime logic

#### Scenario: Retired source directories stay retired

- **WHEN** active source, tests, or root docs are scanned
- **THEN** they SHALL NOT reference retired implementation directories such as
  `src/features`, `src/domain`, `src/reporting`, `src/onboarding`,
  `src/preview`, `src/design`, or `src/ui`

### Requirement: Route wrappers remain thin

Route files under `src/app` SHALL bind routing, navigation, localized copy, and
startup side effects without embedding screen UI implementations or skin
manifest parsing logic.

#### Scenario: Route wrappers delegate visual screens

- **WHEN** a route renders user-visible screen content
- **THEN** it SHALL import the corresponding screen component from `src/pages`
- **AND** it SHALL pass data and callbacks through props
- **AND** the screen component SHALL own the visual composition

#### Scenario: Root layout delegates startup side effects

- **WHEN** `src/app/_layout.tsx` coordinates preview routing, skin persistence,
  or preview-ready markers
- **THEN** those concerns SHALL be implemented through focused local helpers or
  hooks
- **AND** the layout component SHALL remain responsible for composing the root
  providers and stack screens

### Requirement: Page screens stay behavior-preserving during splits

The implementation SHALL preserve the public screen component API and
observable UI behavior when page-level files are split unless a spec explicitly
changes that behavior.

#### Scenario: My screen is split into local components

- **WHEN** `src/pages/my/MyScreen.tsx` is refactored
- **THEN** language picker, skin picker, status/entry cards, and type contracts
  MAY move to local files under `src/pages/my/`
- **AND** the exported `MyScreen` component SHALL preserve its current props API
- **AND** existing language and skin picker interactions SHALL continue to work

### Requirement: Skin manifest parsing remains reusable and stable

Skin manifest parsing SHALL remain independent from route and page code so it
can be reused for bundled and future downloaded skin packages.

#### Scenario: Manifest parser internals are split

- **WHEN** `src/skin/manifest.ts` is refactored
- **THEN** whitelist definitions, field readers, and page parsing helpers MAY be
  moved to focused skin-local files
- **AND** the public parser behavior SHALL still reject invalid manifests
- **AND** `SkinManifestParseError` SHALL remain the error type for manifest
  validation failures

### Requirement: Structure contracts are executable

The repository SHALL include tests that verify the active structure contract
without relying only on prose documentation.

#### Scenario: Structure contract test runs

- **WHEN** `pnpm test tests/support/source-structure.test.ts --runInBand` is run
- **THEN** it SHALL verify active directory references
- **AND** it SHALL reject retired directory references
- **AND** it SHALL verify root guidance mentions current source boundaries and
  screenshot command contracts

#### Scenario: Structure tests avoid brittle size rules

- **WHEN** structure contract tests are updated
- **THEN** they SHALL prefer stable path, import, and documentation assertions
- **AND** they SHALL NOT enforce exact source line-count limits as the primary
  architectural guardrail

