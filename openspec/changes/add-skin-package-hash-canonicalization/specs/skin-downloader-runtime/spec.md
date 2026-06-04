# Skin Downloader Runtime Specification

## ADDED Requirements

### Requirement: Skin package hash uses a canonical package representation

The skin runtime SHALL calculate package-level integrity from a deterministic
canonical package representation rather than from platform-native paths,
JavaScript object insertion order, or source-adapter-specific JSON shapes.

#### Scenario: Same package hashes identically across path separators

- **WHEN** two package hash inputs describe the same logical package files using
  Windows `\` separators and POSIX `/` separators
- **THEN** the calculated package hash SHALL be identical
- **AND** the canonical file paths used by the hash SHALL be slash-separated
  relative paths

#### Scenario: File input order does not affect package hash

- **WHEN** two package hash inputs contain the same package files in different
  orders
- **THEN** the calculated package hash SHALL be identical
- **AND** file entries SHALL be sorted by normalized relative path before
  hashing

#### Scenario: Manifest property order does not affect package hash

- **WHEN** two manifest objects are logically equivalent but their object
  properties were inserted in different orders
- **THEN** the calculated package hash SHALL be identical
- **AND** manifest serialization for package hashing SHALL use deterministic
  key ordering

#### Scenario: Manifest packageHash is not self-referential

- **WHEN** the manifest contains its own `packageHash` field
- **THEN** package hash canonicalization SHALL avoid including that value as
  mutable self-referential input
- **AND** package hash verification SHALL still compare the calculated package
  hash with manifest `packageHash`

### Requirement: Invalid package hash paths are rejected

The skin runtime SHALL reject package hash inputs that cannot be represented as
safe relative package paths.

#### Scenario: Path traversal is rejected

- **WHEN** a package hash input contains an empty path, `..` traversal,
  absolute path, or URL-like path
- **THEN** package hash calculation SHALL fail
- **AND** the package SHALL NOT become `ready`

#### Scenario: Project-root skins directory is not used

- **WHEN** package hash calculation runs for a downloaded package
- **THEN** it SHALL operate on runtime package data supplied by the downloader
  or source adapter
- **AND** it SHALL NOT read downloaded package files from the project-root
  `skins/` directory

### Requirement: Remote package defaults use canonical package hash

Remote skin source adapters SHALL use the canonical package hash helper when a
descriptor does not provide an explicit package hash.

#### Scenario: Remote descriptor omits package hash

- **WHEN** a remote descriptor has no explicit package hash
- **THEN** the remote adapter SHALL calculate package hash using the canonical
  package representation
- **AND** it SHALL NOT use ad hoc `JSON.stringify` object ordering as the
  package hash contract

#### Scenario: Remote descriptor supplies package hash

- **WHEN** a remote descriptor supplies an explicit package hash
- **THEN** the remote adapter MAY pass that expected hash through to validation
- **AND** manifest `packageHash` comparison SHALL still decide whether the
  package can become `ready`

### Requirement: Package hash mismatch remains recoverable

Package hash canonicalization SHALL preserve the existing recoverable failure
semantics for failed package integrity validation.

#### Scenario: Calculated package hash differs from manifest packageHash

- **WHEN** canonical package hash calculation succeeds but the result differs
  from manifest `packageHash`
- **THEN** package validation SHALL fail with `package-hash-mismatch`
- **AND** the package state SHALL become `failed`
- **AND** the previous active and last-ready skin ids SHALL remain usable

#### Scenario: Package hash calculation fails

- **WHEN** canonical package hash calculation cannot safely represent the
  package input
- **THEN** the package operation SHALL fail recoverably
- **AND** no partial package SHALL become ready
