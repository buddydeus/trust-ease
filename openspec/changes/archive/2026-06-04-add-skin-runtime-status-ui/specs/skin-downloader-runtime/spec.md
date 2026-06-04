# Skin Downloader Runtime Specification

## ADDED Requirements

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
