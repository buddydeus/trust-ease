# Operations and Delivery Plan Specification

## ADDED Requirements

### Requirement: Delivery phases are defined

The technical plan SHALL define staged delivery from planning to production
hardening.

#### Scenario: Delivery roadmap is decomposable

- **WHEN** the delivery plan is read
- **THEN** it SHALL define phases for planning/contracts, monorepo foundation,
  backend skeleton, core product MVP, trigger/review workflows, and production
  hardening
- **AND** each phase SHALL be decomposable into future OpenFlow changes

### Requirement: Testing strategy is layered

The technical plan SHALL define testing layers for client, services, contracts,
state machines, and operations.

#### Scenario: Contract and state-machine tests are required

- **WHEN** backend and shared packages are implemented
- **THEN** domain state-machine tests and API contract tests SHALL be added

#### Scenario: Trigger and notification tests use fake time

- **WHEN** trigger windows or notification retries are tested
- **THEN** tests SHALL use fake clocks or deterministic time controls

#### Scenario: Security regressions are tested

- **WHEN** authorization, vault release, audit, or review behavior is changed
- **THEN** tests SHALL cover access boundaries and audit event creation

### Requirement: Production operations are planned

The technical plan SHALL include production operations concerns before launch.

#### Scenario: Observability is required

- **WHEN** production services are planned
- **THEN** structured logs, metrics, traces, and alerting SHALL be included

#### Scenario: Backup and restore are required

- **WHEN** persistent stores or vault materials are planned
- **THEN** backup, restore, retention, and disaster-recovery procedures SHALL be
  documented before production use

#### Scenario: Release safety is required

- **WHEN** production release workflows are planned
- **THEN** migration strategy, rollback criteria, feature flags, and environment
  separation SHALL be documented

### Requirement: Future changes are named

The technical plan SHALL identify future OpenFlow changes needed to implement
the product architecture.

#### Scenario: Follow-up implementation changes are listed

- **WHEN** the planning change is complete
- **THEN** it SHALL list future changes for monorepo setup, mobile app move,
  domain contracts, API contracts, trigger state machine, secure vault,
  review/admin architecture, and operations/security docs
