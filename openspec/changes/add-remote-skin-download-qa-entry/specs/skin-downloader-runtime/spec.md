# Skin Downloader Runtime Specification

## ADDED Requirements

### Requirement: Remote skin QA flow exercises downloader gates

The project SHALL provide an internal QA/dev flow that verifies a remote-style
skin package through the existing remote source adapter and downloader
lifecycle.

#### Scenario: Valid QA package becomes ready

- **WHEN** the QA flow runs with a valid remote-style package fixture
- **THEN** it SHALL stage the manifest and declared static assets through the
  remote source adapter
- **AND** it SHALL call the existing downloader validation and promotion path
- **AND** the resulting package state SHALL become `ready`
- **AND** the active and last-ready skin ids SHALL reflect the promoted package

#### Scenario: QA flow uses runtime storage semantics

- **WHEN** the QA flow stages and promotes a package
- **THEN** it SHALL use downloader file-system abstractions or Expo runtime skin
  path helpers
- **AND** it SHALL NOT treat the project-root `skins/` directory as mobile
  runtime storage

### Requirement: Remote skin QA failures are recoverable

The remote skin QA flow SHALL verify that invalid remote-style packages fail
without replacing the previous ready skin.

#### Scenario: Stale package hash fails recoverably

- **WHEN** the QA flow runs with a package whose canonical package hash differs
  from manifest `packageHash`
- **THEN** the package operation SHALL fail with a package hash validation
  reason
- **AND** the previous active and last-ready skin ids SHALL remain unchanged
- **AND** no partial package SHALL become ready

#### Scenario: Stale asset hash fails recoverably

- **WHEN** the QA flow runs with a package whose declared asset hash differs
  from the staged asset content
- **THEN** the package operation SHALL fail with an asset hash validation reason
- **AND** the previous active and last-ready skin ids SHALL remain unchanged
- **AND** no partial package SHALL become ready

### Requirement: Remote skin QA status uses existing UI boundaries

The remote skin QA flow SHALL allow ready and failed package states to be
verified through the existing skin runtime status surface without coupling pages
to downloader internals.

#### Scenario: Ready QA package is visible in status model

- **WHEN** a QA package becomes ready
- **THEN** the My/settings status surface SHALL be able to receive that package
  state through existing props or store-backed data
- **AND** it SHALL display the ready state without importing downloader or
  remote adapter implementation details

#### Scenario: Failed QA package is visible in status model

- **WHEN** a QA package fails validation
- **THEN** the My/settings status surface SHALL be able to receive that failed
  package state through existing props or store-backed data
- **AND** it SHALL display a calm failed state without implying irreversible
  product failure

### Requirement: Remote skin QA remains internal

The remote skin QA entry SHALL remain an internal developer and QA mechanism.

#### Scenario: QA entry is not a public skin store

- **WHEN** the QA flow is added
- **THEN** it SHALL NOT expose a public user-facing marketplace or skin store
- **AND** it SHALL NOT introduce a production remote skin index service

#### Scenario: QA entry remains data-only

- **WHEN** the QA flow handles remote-style packages
- **THEN** it SHALL treat manifest and assets as data
- **AND** it SHALL NOT execute remote JavaScript, React components, or plugins
