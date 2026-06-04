# app-init-state-machine Specification

## Purpose
TBD - created by archiving change add-skin-downloader-init-state-machine. Update Purpose after archive.
## Requirements
### Requirement: Startup resolves to a renderable skin

App initialization SHALL always resolve to a renderable skin runtime when a
bundled default skin exists.

#### Scenario: No persisted skin state exists

- **WHEN** the app starts without persisted skin state
- **THEN** initialization SHALL select the bundled default skin
- **AND** it SHALL mark the bundled default package as `ready`
- **AND** it SHALL persist the bundled default as active and last-ready

#### Scenario: Persisted active skin is ready

- **WHEN** the app starts with a persisted active skin whose package is ready and
  compatible
- **THEN** initialization SHALL keep that skin active
- **AND** it SHALL preserve the last-ready skin id

#### Scenario: Persisted active skin is not ready

- **WHEN** the app starts with a persisted active skin whose package is missing,
  failed, partial, or incompatible
- **THEN** initialization SHALL fall back to the persisted last-ready skin when
  that skin is ready
- **AND** it SHALL otherwise fall back to the bundled default skin
- **AND** it SHALL persist the resolved active skin

#### Scenario: Bundled default is unavailable

- **WHEN** the bundled default skin cannot be loaded
- **THEN** initialization MAY fail hard
- **AND** the failure SHALL be explicit because the app has no safe renderable
  fallback

### Requirement: Last-ready skin is protected

Initialization and downloader operations SHALL NOT overwrite `lastReadySkinId`
with a failed, partial, or incompatible skin.

#### Scenario: Selected skin download fails

- **WHEN** the user-selected skin fails download or validation
- **THEN** `lastReadySkinId` SHALL remain unchanged
- **AND** `activeSkinId` SHALL remain or return to the last ready skin
- **AND** the failed package SHALL be persisted as `failed`

#### Scenario: Selected skin becomes ready

- **WHEN** the user-selected skin is fully validated and promoted
- **THEN** `activeSkinId` SHALL become that skin
- **AND** `lastReadySkinId` SHALL become that skin
- **AND** its package state SHALL be persisted as `ready`

### Requirement: Init state is explicit and observable

Skin initialization SHALL expose explicit app-level status so startup behavior
can be tested and UI can later render non-ready states without knowing
downloader internals.

#### Scenario: Initialization starts

- **WHEN** skin initialization begins
- **THEN** app state SHALL expose an initializing or checking status
- **AND** route code SHALL not need to inspect package files directly

#### Scenario: Initialization completes with fallback

- **WHEN** initialization falls back from a selected skin to a ready bundled or
  last-ready skin
- **THEN** app state SHALL expose the resolved active skin
- **AND** it SHALL preserve enough status to distinguish fallback from direct
  success for tests or future UI

#### Scenario: Recoverable package failure occurs

- **WHEN** a package operation fails but a fallback skin is available
- **THEN** initialization SHALL complete with a renderable skin
- **AND** the package failure SHALL be represented in package state rather than
  thrown through root layout

### Requirement: Initialization is testable outside React

Initialization decision logic SHALL be testable as a pure or
dependency-injected runtime function that resolves active skin, last-ready skin,
and package states.

#### Scenario: Resolver is tested with persisted snapshots

- **WHEN** tests provide persisted skin state snapshots and package readiness
  information
- **THEN** the resolver SHALL return the expected active skin, last-ready skin,
  and package state updates without mounting React components

#### Scenario: Route hook adapts resolver result

- **WHEN** the route-layer startup hook runs
- **THEN** it SHALL delegate decision logic to the resolver or skin runtime
  helper
- **AND** it SHALL only apply the result to the store and persistence layer

### Requirement: Existing product behavior is preserved

The init state machine SHALL preserve current page behavior unless a later spec
explicitly changes the user experience.

#### Scenario: Current bundled skin remains active by default

- **WHEN** the app has only the bundled `skin-001` package
- **THEN** current pages SHALL continue to render with `skin-001`
- **AND** existing My page skin picker behavior SHALL continue to work

#### Scenario: No UI redesign is included

- **WHEN** initialization state is added
- **THEN** existing screens SHALL NOT be redesigned as part of this change
- **AND** any new user-visible text SHALL follow existing i18n rules

### Requirement: Skin initialization status is visible in settings

The mobile app SHALL expose skin initialization status in the My/settings area
using existing store state.

#### Scenario: Initialization is ready

- **WHEN** skin initialization has resolved to a ready active skin
- **THEN** the My/settings skin status surface SHALL show a ready status
- **AND** it SHALL identify the current active skin by display name when known

#### Scenario: Initialization is checking or initializing

- **WHEN** skin initialization is in an initializing or checking state
- **THEN** the My/settings skin status surface SHALL show a calm checking
  message
- **AND** it SHALL NOT require page code to inspect package files directly

#### Scenario: Initialization used fallback

- **WHEN** `skinInitUsedFallback` is true
- **THEN** the My/settings skin status surface SHALL show a distinct fallback
  note
- **AND** the note SHALL indicate that the app is using a safe fallback style
  without alarming language

### Requirement: Skin status UI preserves route boundaries

The route layer SHALL pass store-backed skin status data into page components
without owning display formatting or downloader logic.

#### Scenario: My route provides status data

- **WHEN** the My route renders the My page
- **THEN** it MAY select skin status fields from the app store
- **AND** it SHALL pass those fields to page components through props

#### Scenario: My route remains thin

- **WHEN** skin status UI is added
- **THEN** route files SHALL NOT import downloader internals, remote source
  adapter internals, manifest parsing helpers, or package validation helpers

