# App Init State Machine Specification

## ADDED Requirements

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
