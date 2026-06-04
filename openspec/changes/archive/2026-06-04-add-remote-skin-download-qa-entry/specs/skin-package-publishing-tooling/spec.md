# Skin Package Publishing Tooling Specification

## ADDED Requirements

### Requirement: Publishing tooling supports remote QA fixtures

The local skin package publishing tooling SHALL be reusable by the remote skin
QA flow to prepare deterministic remote-style package fixtures.

#### Scenario: QA fixture is prepared with publishing helper

- **WHEN** the remote skin QA flow needs a local package fixture
- **THEN** it SHALL prepare or validate that fixture through the existing
  publishing helper or `pnpm skin:package` command
- **AND** the fixture's asset hashes and `packageHash` SHALL match runtime
  canonical hashing rules

#### Scenario: QA fixture generation is deterministic

- **WHEN** the same QA fixture inputs are prepared repeatedly
- **THEN** generated asset hashes and package hash SHALL remain stable
- **AND** repeated preparation SHALL NOT produce unnecessary manifest changes

### Requirement: Publishing tooling stays local during QA setup

Remote skin QA fixture preparation SHALL preserve the publishing tool's
local-only trust boundary.

#### Scenario: QA setup does not fetch remote files through publishing tooling

- **WHEN** QA fixture preparation runs
- **THEN** publishing tooling SHALL read only local package files
- **AND** remote fetching SHALL remain the responsibility of the remote source
  adapter or QA harness

#### Scenario: QA setup does not write runtime storage through publishing tooling

- **WHEN** QA fixture preparation runs
- **THEN** publishing tooling SHALL NOT write to Expo FileSystem runtime storage
- **AND** downloader promotion SHALL remain the only path that makes a package
  ready
