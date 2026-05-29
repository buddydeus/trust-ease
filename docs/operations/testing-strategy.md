# Testing Strategy

Testing should prove contracts, permissions, state machines, and sensitive
transitions. Visual confidence matters, but the highest risk is authorization or
trigger behavior going wrong.

## Layers

### Domain Unit Tests

Scope:

- state machines;
- policy evaluation;
- authorization decisions;
- trigger thresholds;
- release eligibility.

Run in packages such as `packages/domain`.

### API Contract Tests

Scope:

- request schemas;
- response schemas;
- error shapes;
- backwards-compatible contract changes.

Run against `packages/api-contracts` and service handlers.

### Service Integration Tests

Scope:

- database transactions;
- queue job creation;
- object storage metadata;
- audit writes;
- permission checks.

Use local test infrastructure and deterministic fixtures.

### Worker Tests

Scope:

- missed confirmation windows;
- notification retries;
- trigger escalation;
- delayed review tasks;
- execution routing.

Use fake clocks or deterministic time controls. Do not let wall-clock time drive
test outcomes.

### Client Tests

Scope:

- route wrappers;
- screen interactions;
- locale rendering;
- skin compatibility;
- screenshot readiness.

The current mobile app already uses Jest and React Native Testing Library.

### End-To-End Smoke Tests

Scope:

- owner first setup;
- safe report;
- trigger simulation;
- contact invitation;
- reviewer approval happy path.

Keep E2E tests few and high-value.

### Security Regression Tests

Scope:

- contact A cannot see contact B material;
- executor cannot see unrelated vault documents;
- reviewer cannot see unassigned cases without permission;
- single missed check cannot reach irreversible execution;
- vault release requires eligibility and approval;
- sensitive reads create audit events.

## CI Expectations

Minimum future monorepo CI should include:

- format/lint;
- type-check all packages;
- unit tests;
- API contract tests;
- selected integration tests;
- mobile screenshot/export checks where practical;
- OpenSpec validation for active changes.

## Release Safety

Before production release:

- migrations have rollback criteria;
- feature flags protect high-risk flows;
- environments are separated;
- audit event changes are reviewed;
- backup/restore has a tested path;
- alerts exist for trigger, vault, notification, review, and queue failures.
