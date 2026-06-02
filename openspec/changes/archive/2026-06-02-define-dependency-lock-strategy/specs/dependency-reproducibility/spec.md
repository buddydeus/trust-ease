# Dependency Reproducibility Specification

## ADDED Requirements

### Requirement: Dependency lockfile policy is explicit

The repository SHALL define and apply a deterministic dependency lockfile policy
for pnpm-based development.

#### Scenario: Lockfile is tracked

- **WHEN** the repository is prepared for fresh checkout or machine migration
- **THEN** `pnpm-lock.yaml` SHALL be present in version control
- **AND** dependency installation SHALL resolve from that lockfile by default

#### Scenario: Lockfile is refreshed intentionally

- **WHEN** direct dependencies or package manager policy changes
- **THEN** the lockfile SHALL be updated in the same change
- **AND** the change summary SHALL mention that dependency resolution changed

#### Scenario: Frozen install is required for verification

- **WHEN** a clean verification or CI-style install is performed
- **THEN** the documented command SHALL use a frozen lockfile mode
- **AND** lockfile drift SHALL fail the install instead of being silently
  rewritten

### Requirement: Package manager version policy is explicit

The repository SHALL document and encode the pnpm version policy used for
dependency installation.

#### Scenario: Package manager is pinned

- **WHEN** a developer reads `package.json`
- **THEN** it SHALL declare the intended package manager through
  `packageManager`
- **AND** the declared package manager SHALL be pnpm

#### Scenario: Fresh machine setup is documented

- **WHEN** a developer checks out the project on a new machine
- **THEN** human-facing docs SHALL describe how to install with the pinned pnpm
  version or Corepack-compatible setup

### Requirement: Registry behavior is reproducible

The repository SHALL define registry behavior so installs can be repeated across
machines while still allowing local mirror usage when needed.

#### Scenario: Default registry policy is documented

- **WHEN** install guidance is read
- **THEN** it SHALL state the default registry expected for reproducible
  dependency resolution
- **AND** it SHALL state how to override the registry locally when a mirror or
  official registry is needed

#### Scenario: Mirror failure has a fallback

- **WHEN** dependency installation fails because a mirror is stale or
  unavailable
- **THEN** docs SHALL provide an official registry fallback command or setting
- **AND** that fallback SHALL NOT require editing `.ai/` files

#### Scenario: npm warning noise is minimized

- **WHEN** repository commands are invoked through `npm exec` or other npm-based
  wrappers
- **THEN** avoidable warnings from pnpm-only configuration SHALL be removed or
  documented as intentional

### Requirement: Dependency ranges preserve current runtime compatibility

Direct dependency declarations SHALL preserve the current Expo, React Native,
test, and TypeScript compatibility envelope.

#### Scenario: Expo SDK compatibility is preserved

- **WHEN** dependency ranges are adjusted
- **THEN** Expo SDK 55 packages SHALL remain aligned with the current app
  runtime
- **AND** the app SHALL NOT be upgraded to another Expo SDK as part of this
  change

#### Scenario: React test stack compatibility is preserved

- **WHEN** dependency ranges are adjusted
- **THEN** React 19, React Native 0.85, React Native Testing Library, Jest 29,
  and `react-test-renderer` SHALL remain mutually compatible
- **AND** focused page and skin tests SHALL continue to pass

#### Scenario: Broad dependency ranges are reviewed

- **WHEN** direct dependencies use `latest`, major-only, or otherwise broad
  ranges
- **THEN** the implementation SHALL either narrow the range or document why the
  range is acceptable with the tracked lockfile

### Requirement: Verification covers dependency-sensitive contracts

Dependency reproducibility changes SHALL be verified against the current
TypeScript, skin runtime, and structure contracts.

#### Scenario: Core verification is run

- **WHEN** the dependency policy implementation is complete
- **THEN** `pnpm check:type` SHALL pass
- **AND** `pnpm test tests/skin --runInBand` SHALL pass
- **AND** `pnpm test tests/support/source-structure.test.ts --runInBand` SHALL
  pass

#### Scenario: User-visible copy is unchanged

- **WHEN** the implementation does not modify user-visible strings
- **THEN** locale files SHALL NOT be changed solely for this dependency policy
- **AND** `pnpm check:local` is not required unless user-visible copy changes
