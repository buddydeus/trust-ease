# skin-downloader-runtime Specification

## Purpose
TBD - created by archiving change add-skin-downloader-init-state-machine. Update Purpose after archive.
## Requirements
### Requirement: Downloaded skin packages use runtime storage only

Downloaded skin packages SHALL be written only under Expo FileSystem
`documentDirectory/skins/` runtime storage.

#### Scenario: Runtime package directory is resolved

- **WHEN** the downloader prepares storage for a downloaded skin package
- **THEN** it SHALL resolve the package location through the runtime skin path
  helpers
- **AND** it SHALL place package files under `documentDirectory/skins/`
- **AND** it SHALL NOT write downloaded package files into the project-root
  `skins/` directory

#### Scenario: Runtime storage is unavailable

- **WHEN** Expo FileSystem `documentDirectory` is unavailable
- **THEN** the downloader SHALL fail the package operation
- **AND** it SHALL preserve the previous active and last-ready skin ids

### Requirement: Package download lifecycle is explicit

Downloaded skin packages SHALL move through explicit package states so UI and
startup logic can distinguish checking, downloading, ready, failed, and
incompatible packages.

#### Scenario: Package download succeeds

- **WHEN** a package source is accepted for download or staging
- **THEN** the package state SHALL become `checking` before validation starts
- **AND** it SHALL become `downloading` while package files are being written
- **AND** it SHALL return to `checking` while final integrity and compatibility
  are verified
- **AND** it SHALL become `ready` only after all validation succeeds

#### Scenario: Package source fails

- **WHEN** the package source cannot provide all required package files
- **THEN** the package state SHALL become `failed`
- **AND** no partial package SHALL become active

#### Scenario: Package is incompatible

- **WHEN** a structurally valid package requires an app feature version outside
  the current app compatibility range
- **THEN** the package state SHALL become `incompatible`
- **AND** the active skin SHALL remain the previous ready skin

### Requirement: Package validation gates activation

A downloaded skin package SHALL NOT become active unless its manifest,
integrity, and compatibility are valid.

#### Scenario: Manifest is valid

- **WHEN** a downloaded package contains `manifest.json`
- **THEN** the manifest SHALL be parsed with the existing skin manifest parser
- **AND** the parsed `skinId` SHALL match the requested skin id
- **AND** manifest validation failures SHALL mark the package as `failed`

#### Scenario: Asset hash mismatch is detected

- **WHEN** a downloaded manifest declares asset hashes
- **THEN** each declared asset hash SHALL be checked against the stored package
  file
- **AND** any mismatch SHALL prevent the package from becoming `ready`
- **AND** the package state SHALL become `failed`

#### Scenario: Package hash mismatch is detected

- **WHEN** package-level integrity is calculated for a downloaded package
- **THEN** it SHALL be compared with manifest `packageHash`
- **AND** any mismatch SHALL prevent activation
- **AND** the package state SHALL become `failed`

#### Scenario: Compatibility passes

- **WHEN** manifest parsing and integrity checks pass
- **THEN** existing skin compatibility rules SHALL be applied
- **AND** only compatible packages MAY become `ready`

### Requirement: Ready promotion is atomic from the app perspective

The app SHALL treat a downloaded package as ready only after final validation
and promotion into its runtime package directory complete.

#### Scenario: Package is staged before validation

- **WHEN** package files are being downloaded or copied
- **THEN** they SHALL be written into a non-ready staging location
- **AND** the package SHALL NOT be visible as ready during staging

#### Scenario: Promotion succeeds

- **WHEN** validation succeeds
- **THEN** the staged package SHALL be promoted to the ready runtime package
  directory
- **AND** the package state SHALL become `ready`

#### Scenario: Promotion fails

- **WHEN** final promotion fails
- **THEN** the package state SHALL become `failed`
- **AND** existing ready package state SHALL remain usable

### Requirement: Downloader is independent from route and page code

Downloader implementation SHALL stay inside skin runtime modules and SHALL NOT
be embedded in route wrappers or page components.

#### Scenario: Route starts a package operation

- **WHEN** route or app-shell code needs to trigger skin initialization or a skin
  package operation
- **THEN** it SHALL call a focused hook or runtime helper
- **AND** it SHALL NOT contain manifest parsing, hash validation, package
  promotion, or downloader implementation details inline

#### Scenario: Page displays package state

- **WHEN** a page displays skin status
- **THEN** it SHALL receive status through store-backed data or props
- **AND** it SHALL NOT import downloader internals

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

### Requirement: Skin package lifecycle states are visible in settings

The mobile app SHALL expose known skin package lifecycle states in the
My/settings skin status surface.

#### Scenario: Ready package state is shown

- **WHEN** a known skin package state is `ready`
- **THEN** the My/settings skin status surface SHALL show that the style is
  ready

#### Scenario: Checking package state is shown

- **WHEN** a known skin package state is `checking`
- **THEN** the My/settings skin status surface SHALL show that the style is
  being checked

#### Scenario: Downloading package state is shown

- **WHEN** a known skin package state is `downloading`
- **THEN** the My/settings skin status surface SHALL show that the style is
  being downloaded

#### Scenario: Failed package state is shown

- **WHEN** a known skin package state is `failed`
- **THEN** the My/settings skin status surface SHALL show that the style is
  currently unavailable
- **AND** the message SHALL avoid implying irreversible product failure

#### Scenario: Incompatible package state is shown

- **WHEN** a known skin package state is `incompatible`
- **THEN** the My/settings skin status surface SHALL show that the style needs
  an app update or another style

### Requirement: Skin status UI does not expose downloader internals

The skin status surface SHALL present package lifecycle information without
coupling page components to downloader implementation details.

#### Scenario: Known package has display metadata

- **WHEN** a package state maps to a known skin option
- **THEN** the UI SHALL prefer the skin display name over the raw package key

#### Scenario: Known package has no display metadata

- **WHEN** a package state cannot be mapped to a known skin option
- **THEN** the UI MAY show a simple skin id fallback
- **AND** it SHOULD avoid showing the full raw package key unless a later QA
  mode explicitly requires it

#### Scenario: No package states exist

- **WHEN** no package state entries are available
- **THEN** the UI SHALL still render the active skin and initialization status
  summary without error

