# Skin Package Publishing Tooling Specification

## ADDED Requirements

### Requirement: Local skin packages can be checked without mutation

The project SHALL provide a local tooling path that checks a skin package
directory against the runtime skin package integrity contract without modifying
package files.

#### Scenario: Check mode validates an up-to-date package

- **WHEN** a developer runs the skin package tool in check mode against a local
  package directory with current asset hashes and package hash
- **THEN** the command SHALL succeed
- **AND** it SHALL report that the package manifest is current
- **AND** it SHALL NOT write to `manifest.json`

#### Scenario: Check mode detects stale asset hashes

- **WHEN** a declared asset file's current content hash differs from the hash in
  `manifest.json`
- **THEN** check mode SHALL fail
- **AND** it SHALL identify the stale asset path
- **AND** it SHALL NOT update the manifest

#### Scenario: Check mode detects stale package hash

- **WHEN** declared asset hashes are current but top-level `packageHash` differs
  from the canonical package hash
- **THEN** check mode SHALL fail
- **AND** it SHALL identify the package hash mismatch
- **AND** it SHALL NOT update the manifest

### Requirement: Local skin packages can be updated deterministically

The project SHALL provide an update mode that writes calculated asset hashes and
canonical package hash values back to the local package manifest.

#### Scenario: Update mode writes asset hashes

- **WHEN** a developer runs the skin package tool in update mode
- **THEN** each declared static asset hash in `manifest.json` SHALL be replaced
  with the current calculated content hash
- **AND** undeclared files SHALL NOT be added to the manifest automatically

#### Scenario: Update mode writes package hash

- **WHEN** asset hashes have been calculated for all declared static assets
- **THEN** update mode SHALL calculate the canonical package hash using the same
  runtime helper used by the app
- **AND** it SHALL write that value to top-level `packageHash`

#### Scenario: Update mode output is stable

- **WHEN** update mode is run twice without changing package files
- **THEN** the second run SHALL produce no further manifest content changes
- **AND** the calculated package hash SHALL remain identical

### Requirement: Publishing tooling reuses runtime canonical hashing

The skin package publishing tool SHALL reuse the app runtime canonical package
hash contract instead of defining a second package hash algorithm.

#### Scenario: Package hash matches runtime helper

- **WHEN** the tool calculates a package hash from a local package directory
- **THEN** the value SHALL equal `calculateSkinPackageHash` called with the same
  skin identity, manifest source, and file hash entries

#### Scenario: Manifest packageHash remains self-neutralized

- **WHEN** the manifest already contains a `packageHash`
- **THEN** the package hash calculation SHALL avoid using that value as mutable
  self-referential input
- **AND** updating `packageHash` SHALL NOT require multiple runs to converge

### Requirement: Unsafe package paths fail clearly

The skin package publishing tool SHALL reject package inputs that cannot be
represented as safe local package file paths.

#### Scenario: Unsafe asset path is rejected

- **WHEN** a manifest-declared asset path is empty, traversal-based, absolute,
  URL-like, or duplicates another normalized path
- **THEN** the tool SHALL fail
- **AND** it SHALL identify the offending path
- **AND** it SHALL NOT update `manifest.json`

#### Scenario: Missing declared asset is rejected

- **WHEN** a manifest-declared asset path does not exist under the package
  directory
- **THEN** the tool SHALL fail
- **AND** it SHALL identify the missing asset path
- **AND** it SHALL NOT update `manifest.json`

### Requirement: Publishing tooling stays local and non-executable

Skin package publishing tooling SHALL remain a local data preparation tool and
SHALL NOT expand the runtime skin trust model.

#### Scenario: Tool reads local package input only

- **WHEN** the tool runs against a package directory
- **THEN** it SHALL read `manifest.json` and declared static assets from that
  local directory
- **AND** it SHALL NOT fetch remote manifests or assets
- **AND** it SHALL NOT write to Expo FileSystem runtime storage

#### Scenario: Tool does not execute package content

- **WHEN** a package contains JavaScript, React component code, or plugin-like
  files
- **THEN** the tool SHALL NOT execute them
- **AND** package publishing SHALL remain limited to manifest data and declared
  static asset file hashing
