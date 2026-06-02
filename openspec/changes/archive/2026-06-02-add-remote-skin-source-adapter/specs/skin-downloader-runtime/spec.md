# Skin Downloader Runtime Specification

## ADDED Requirements

### Requirement: Remote skin packages can be staged through a source adapter

The skin runtime SHALL provide a remote source adapter that fetches remote skin
package files and stages them through the existing downloader lifecycle.

#### Scenario: Direct remote manifest is fetched

- **WHEN** a remote skin package descriptor provides a manifest URL
- **THEN** the remote source adapter SHALL fetch the manifest as untrusted data
- **AND** it SHALL return that manifest through the existing
  `SkinPackageSourcePayload` validation input

#### Scenario: Declared remote assets are staged

- **WHEN** the fetched manifest declares asset paths
- **THEN** the remote source adapter SHALL resolve those paths against the
  descriptor's asset base URL or manifest URL
- **AND** it SHALL write the fetched assets into the staging directory supplied
  by the downloader
- **AND** it SHALL NOT write assets into the project-root `skins/` directory

#### Scenario: Remote package becomes ready through existing validation

- **WHEN** the remote source adapter successfully stages a complete package
- **THEN** `downloadSkinPackage` SHALL apply the existing manifest, asset hash,
  package hash, feature compatibility, and ready promotion gates
- **AND** the remote adapter SHALL NOT mark a package ready directly

### Requirement: Remote package descriptors are explicit

Remote skin downloads SHALL be requested through a stable descriptor that
identifies the intended package and its fetch locations.

#### Scenario: Descriptor identifies the package

- **WHEN** a remote descriptor is created
- **THEN** it SHALL include skin id and skin version
- **AND** those values SHALL be used as the downloader source identity

#### Scenario: Descriptor locates package files

- **WHEN** a remote descriptor is created
- **THEN** it SHALL include a manifest URL
- **AND** it MAY include an asset base URL for relative manifest asset paths
- **AND** it MAY include package integrity or display metadata for future UI

#### Scenario: Remote index is deferred

- **WHEN** a remote skin index endpoint is needed
- **THEN** it SHALL resolve to remote descriptors before package staging begins
- **AND** index fetching SHALL NOT bypass the remote descriptor and downloader
  validation path

### Requirement: Remote downloads expose progress without changing page boundaries

Remote source adapters SHALL expose operation progress in a way that future UI
can consume without importing downloader internals into pages or routes.

#### Scenario: Progress callback is provided

- **WHEN** a caller provides a progress callback
- **THEN** the remote source adapter SHALL report manifest and asset download
  progress through that callback
- **AND** the callback data SHALL remain separate from persisted package state

#### Scenario: Progress callback is absent

- **WHEN** no progress callback is provided
- **THEN** the remote source adapter SHALL still stage and validate the package
  through the existing downloader lifecycle

#### Scenario: Page displays future progress

- **WHEN** a page later displays remote download progress
- **THEN** it SHALL receive store-backed data or props
- **AND** it SHALL NOT import remote adapter implementation details

### Requirement: Remote failure, retry, timeout, and cancellation are recoverable

Remote package failures SHALL be represented as recoverable package operation
failures and SHALL preserve the previous active and last-ready skin.

#### Scenario: Manifest fetch fails

- **WHEN** the manifest URL is unreachable, returns an invalid response, or
  times out after configured retries
- **THEN** the source adapter SHALL fail the package operation
- **AND** the previous active and last-ready skin ids SHALL remain unchanged

#### Scenario: Asset fetch fails

- **WHEN** a declared asset cannot be fetched or written into staging after
  configured retries
- **THEN** the source adapter SHALL fail the package operation
- **AND** no partial remote package SHALL become ready

#### Scenario: Remote download is cancelled

- **WHEN** cancellation is requested before validation and promotion complete
- **THEN** the source adapter SHALL stop staging work as soon as practical
- **AND** the package operation SHALL fail recoverably
- **AND** no partial remote package SHALL become ready

#### Scenario: Retry policy is deterministic

- **WHEN** retry behavior is configured
- **THEN** retry count and delay behavior SHALL be dependency-injected or
  otherwise testable without real time sleeps

### Requirement: Remote downloads do not introduce remote code execution

Remote skin package support SHALL preserve the controlled skin model of local
components plus manifest-driven orchestration.

#### Scenario: Remote manifest is processed

- **WHEN** a remote manifest is fetched
- **THEN** it SHALL be treated as data for the existing manifest parser and
  validation pipeline
- **AND** it SHALL NOT be evaluated as JavaScript or rendered as a remote React
  component

#### Scenario: Remote assets are processed

- **WHEN** remote assets are fetched
- **THEN** they SHALL be stored as package files for validated skin data
- **AND** they SHALL NOT provide executable component logic
