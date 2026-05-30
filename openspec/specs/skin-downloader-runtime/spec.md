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

