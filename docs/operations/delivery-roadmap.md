# Delivery Roadmap

The product should be delivered as a sequence of small OpenFlow changes. Avoid
starting backend, admin, vault, trigger engine, and monorepo migration all at
once.

## Phase 0: Planning And Contracts

Goal: make the product and engineering map explicit.

Outputs:

- product plan;
- monorepo architecture plan;
- product domain and API boundary plan;
- security baseline and threat model;
- operations and testing strategy.

## Phase 1: Monorepo Foundation

Goal: introduce workspace boundaries without changing product behavior.

Candidate OpenFlow changes:

- `setup-pnpm-monorepo-workspace`
- `move-mobile-app-to-apps-mobile`
- `add-shared-config-package`

Verification:

- mobile routes still work;
- tests still pass;
- screenshot scripts still work;
- type-checking works from workspace root.

## Phase 2: Backend Skeleton

Goal: create backend shape and shared contracts before product logic grows.

Candidate OpenFlow changes:

- `add-domain-contract-package`
- `add-api-contract-package`
- `add-api-service-skeleton`
- `add-worker-service-skeleton`

Verification:

- package tests;
- API contract tests;
- local service boot checks;
- schema validation tests.

## Phase 3: Core Product MVP

Goal: support owner setup with safe, review-gated behavior.

Candidate OpenFlow changes:

- `add-identity-account-domain`
- `add-contact-authorization-domain`
- `add-trust-item-domain`
- `add-secure-vault-metadata`
- `add-trigger-policy-simulation`

Verification:

- owner setup happy path;
- contact authorization boundaries;
- item CRUD;
- vault metadata access rules;
- trigger simulation tests.

## Phase 4: Trigger And Review Workflows

Goal: implement high-risk escalation with manual gates.

Candidate OpenFlow changes:

- `add-trigger-state-machine-contracts`
- `add-notification-orchestration`
- `add-review-admin-architecture`
- `add-execution-task-routing`
- `add-audit-event-pipeline`

Verification:

- fake-clock trigger tests;
- notification retry tests;
- reviewer queue tests;
- audit event tests;
- freeze and appeal tests.

## Phase 5: Production Hardening

Goal: make the system operable and reviewable before production launch.

Candidate OpenFlow changes:

- `add-operations-security-docs`
- `add-backup-restore-runbooks`
- `add-observability-baseline`
- `add-release-safety-process`
- `add-data-retention-policy`

Verification:

- restore drill documentation;
- migration rollback test;
- alert routing test;
- incident runbook review;
- compliance review checklist.

## Ordering Rule

Build contracts before services, services before high-risk automation, and
manual review gates before irreversible execution.
