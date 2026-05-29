# Product Technical Plan Specification

## ADDED Requirements

### Requirement: PRD modules map to technical domains

The technical plan SHALL map the PRD modules into bounded technical domains.

#### Scenario: Core domains are listed

- **WHEN** a future engineer reads the product technical plan
- **THEN** it SHALL define domains for identity/account, contact/authorization,
  trust items, secure vault, trigger engine, notification orchestration,
  execution routing, review/risk control, audit/compliance, and client
  experience

#### Scenario: Each domain has ownership

- **WHEN** a domain is documented
- **THEN** it SHALL describe the domain's primary responsibilities
- **AND** it SHALL distinguish write ownership from shared contract reuse

### Requirement: Core aggregate roots are defined

The technical plan SHALL identify the core aggregate roots needed for backend
and shared contract design.

#### Scenario: Product data roots are listed

- **WHEN** the data model plan is read
- **THEN** it SHALL include aggregate roots for user account, identity
  verification, trusted contact, authorization grant, trust item, vault
  document, trigger policy, trigger incident, notification attempt, execution
  task, review case, and audit event

#### Scenario: Domain writes remain owned

- **WHEN** one domain needs another domain's data
- **THEN** it SHALL consume a documented API, query, event, or shared contract
- **AND** it SHALL NOT directly own another domain's write model

### Requirement: Core state machines are defined

The technical plan SHALL define state-machine contracts for high-risk flows.

#### Scenario: Trigger lifecycle is documented

- **WHEN** trigger behavior is planned
- **THEN** it SHALL include normal, missed-check, pre-alert,
  contact-verification, pending-review, approved-execution, executing, and
  completed states
- **AND** it SHALL include paused, frozen, or appealed exits for high-risk
  states

#### Scenario: Vault release lifecycle is documented

- **WHEN** secure vault release behavior is planned
- **THEN** it SHALL include sealed, eligible-for-review, approved-for-release,
  released, and revoked states

#### Scenario: Execution task lifecycle is documented

- **WHEN** execution routing is planned
- **THEN** it SHALL include pending, routed, in-progress, blocked, completed,
  and cancelled states

### Requirement: API boundaries are described

The technical plan SHALL define initial API groups for the product system.

#### Scenario: Product API groups are listed

- **WHEN** API planning is read
- **THEN** it SHALL list API groups for auth, account, contacts,
  authorizations, items, vault, trigger policy, trigger incidents,
  notifications, execution tasks, review, audit, and skins

#### Scenario: Admin and contact surfaces can diverge safely

- **WHEN** admin or contact portal APIs require different permissions or response
  shapes
- **THEN** they SHALL use separate BFF surfaces or explicit API contracts rather
  than overloading mobile response shapes
