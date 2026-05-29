# monorepo-architecture Specification

## Purpose
TBD - created by archiving change define-monorepo-product-technical-plan. Update Purpose after archive.
## Requirements
### Requirement: Target monorepo layout is defined

The product technical plan SHALL define a target monorepo layout that separates
applications, services, shared packages, infrastructure, and documentation.

#### Scenario: Applications are separated by user surface

- **WHEN** a future engineer reads the monorepo plan
- **THEN** it SHALL define `apps/mobile` for the current Expo Router app
- **AND** it SHALL define `apps/admin` for platform reviewer and operations
  workflows
- **AND** it SHALL define `apps/contact-portal` for trusted contact and
  executor workflows

#### Scenario: Services are separated by runtime responsibility

- **WHEN** a future engineer reads the monorepo plan
- **THEN** it SHALL define a public API or BFF service boundary
- **AND** it SHALL define worker/background processing boundaries
- **AND** it SHALL define integration adapter boundaries for third-party or
  official-process execution routes

#### Scenario: Shared packages do not become service dumping grounds

- **WHEN** shared packages are defined
- **THEN** they SHALL be limited to domain contracts, API contracts,
  configuration, shared i18n contracts, UI primitives, and testing helpers
- **AND** service-specific business logic SHALL remain inside the owning service
  or app boundary

### Requirement: Current app migration is phased

The product technical plan SHALL keep current code movement separate from this
planning change.

#### Scenario: Planning does not move current Expo files

- **WHEN** this change is applied
- **THEN** it SHALL NOT move the current root Expo app into `apps/mobile`
- **AND** it SHALL instead document a later monorepo migration phase

#### Scenario: Future migration preserves behavior

- **WHEN** a later change moves the mobile app into `apps/mobile`
- **THEN** it SHALL preserve Expo Router behavior, screenshot scripts, i18n,
  tests, and skin runtime semantics

### Requirement: Workspace tooling direction is specified

The product technical plan SHALL define a TypeScript-first workspace strategy.

#### Scenario: Workspace defaults are documented

- **WHEN** tooling guidance is read
- **THEN** it SHALL recommend pnpm workspaces as the default monorepo foundation
- **AND** it SHALL keep build orchestration simple until cross-package caching is
  justified
- **AND** it SHALL keep TypeScript as the shared language across client,
  service, contracts, and tests

