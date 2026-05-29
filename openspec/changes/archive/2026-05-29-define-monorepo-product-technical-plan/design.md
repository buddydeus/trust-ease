# Design: Monorepo Product Technical Plan

## Overview

This design defines how the current single Expo app can grow into a monorepo
product system for “安心 App”. It is intentionally a planning artifact. It does
not move files or implement services. Its job is to define the map: product
capabilities, technical domains, app/service boundaries, data ownership,
security model, delivery phases, and future change decomposition.

## Target Monorepo Shape

```text
apps/
  mobile/              # Current Expo Router app, moved later from root src/
  admin/               # Platform review, risk control, support operations
  contact-portal/      # Trusted contact / executor web portal

services/
  api/                 # Authenticated API and backend-for-frontend
  worker/              # Async jobs, trigger checks, notification fanout
  integrations/        # Third-party API adapters and official-process helpers

packages/
  domain/              # Shared domain types, state machines, events
  api-contracts/       # Zod/OpenAPI-compatible request/response schemas
  config/              # Typed app/service/env config
  i18n/                # Shared message contracts when web/admin appear
  ui/                  # Shared primitives after mobile UI stabilizes
  testing/             # Fixtures, contract-test helpers, fake clocks

infra/
  local/               # Local compose/dev infra
  deploy/              # Environment definitions
  observability/       # Logs, metrics, traces, alerts

docs/
  product/             # PRD, roles, flows, non-goals
  architecture/        # System diagrams, domain boundaries, ADRs
  security/            # Threat model, data classification, compliance notes
  operations/          # Runbooks, incidents, backup/restore, release process
```

The existing root Expo app should not be moved by this planning change. A later
implementation change can create workspace scaffolding and move code in small
steps.

## Product Domains

### Identity & Account

Owns registration, login, identity verification state, recovery, account freeze,
MFA, and account-level security settings.

### Contact & Authorization

Owns trusted contacts, executors, roles, notification order, authorization
scope, invitation status, and consent/acknowledgement records.

### Trust Item Catalog

Owns user-created items, templates, item categories, risk levels, execution
mode, required materials, assigned executor, and item lifecycle.

### Secure Vault

Owns uploaded documents, encrypted metadata, file permissions, release rules,
evidence packages, download audit, and retention/deletion workflow.

### Trigger Engine

Owns active checks, missed confirmation windows, escalation thresholds,
multi-signal decisions, pre-alert state, review state, execution state, pause,
freeze, appeal, and simulation runs.

### Notification Orchestration

Owns message templates, channels, fanout order, delivery receipts, retry policy,
quiet hours, and channel-specific compliance constraints.

### Execution Routing

Owns task routing into API automation, official process guidance, manual
assistance, partner work orders, and executor-facing next steps.

### Review & Risk Control

Owns platform reviewer queues, evidence review, irreversible-action gates,
manual override, fraud/risk flags, and incident triage.

### Audit & Compliance

Owns immutable audit events, access logs, export logs, consent logs, retention,
legal hold markers, and data subject request workflow.

### Skin & Client Experience

Owns mobile client presentation contracts, controlled skin manifests, locale
contracts, app preview/screenshot workflows, and client feature compatibility.

## Recommended Stack Direction

The monorepo should keep TypeScript as the shared language across client,
backend, workers, contracts, and tests. That keeps domain schemas and state
machine contracts close to the current Expo app.

Recommended defaults for future implementation:

- Package manager: pnpm workspaces.
- Build orchestration: start simple with workspace scripts; introduce Turborepo
  only when cross-package build caching is needed.
- Backend runtime: Node.js TypeScript.
- API contract style: Zod schemas exported from `packages/api-contracts`, with
  generated OpenAPI later if needed.
- Database: relational primary store for authorization, state machines, audit,
  and review workflows.
- Object storage: encrypted file blobs for vault documents.
- Queue: durable background jobs for trigger checks, notification fanout, and
  execution routing.
- Observability: structured logs, metrics, traces, audit event sinks.

Exact provider choices should be deferred to implementation specs so this plan
stays portable.

## Core State Machines

### User Plan Lifecycle

```text
draft -> configured -> active -> paused -> frozen -> closed
```

### Trigger Lifecycle

```text
normal
  -> missed-check
  -> pre-alert
  -> contact-verification
  -> pending-review
  -> approved-execution
  -> executing
  -> completed

Any high-risk state -> paused | frozen | appealed
```

### Vault Release Lifecycle

```text
sealed -> eligible-for-review -> approved-for-release -> released -> revoked
```

### Execution Task Lifecycle

```text
pending -> routed -> in-progress -> blocked -> completed -> cancelled
```

All irreversible transitions require audit events and, where appropriate,
reviewer approval.

## Data Ownership

Each domain owns its write model. Other domains consume events or read through
API/query surfaces. Shared packages define types and state-machine contracts,
but shared packages must not become a dumping ground for service-specific
business logic.

Important aggregate roots:

- `UserAccount`
- `IdentityVerification`
- `TrustedContact`
- `AuthorizationGrant`
- `TrustItem`
- `VaultDocument`
- `TriggerPolicy`
- `TriggerIncident`
- `NotificationAttempt`
- `ExecutionTask`
- `ReviewCase`
- `AuditEvent`

## Security Model

Security is part of the product, not a later hardening step.

Baseline controls:

- least privilege for contacts, executors, partners, reviewers, and services;
- no plaintext third-party password custody;
- encryption at rest for sensitive records and vault file blobs;
- envelope encryption for vault materials where the storage provider is not the
  trust boundary;
- immutable audit events for sensitive reads, writes, releases, approvals, and
  downloads;
- multi-signal trigger decisions with pre-alert and review gates;
- irreversible actions require explicit policy gates and, for MVP, manual
  review;
- simulation mode is separate from production trigger execution;
- account freeze and appeal paths exist for suspected mis-trigger or abuse.

## API Boundary

The mobile app should communicate through stable API contracts rather than
directly embedding backend business rules.

Initial API groups:

- `/auth`
- `/account`
- `/contacts`
- `/authorizations`
- `/items`
- `/vault`
- `/trigger-policy`
- `/trigger-incidents`
- `/notifications`
- `/execution-tasks`
- `/review`
- `/audit`
- `/skins`

The admin app and contact portal can share contract packages but should have
separate BFF surfaces where permissions or response shapes differ.

## Testing Strategy

Testing should be layered:

- package unit tests for domain state machines and schema validation;
- API contract tests for request/response compatibility;
- service integration tests for database and queue behavior;
- worker tests with fake clocks for trigger windows and notification retries;
- client tests for route/page behavior, i18n, and skin compatibility;
- end-to-end smoke tests for happy path onboarding, simulation, and reviewer
  approval flows;
- security regression tests for authorization boundaries and audit logging.

## Delivery Phases

### Phase 0: Planning and Contracts

Create product/architecture/security documentation and shared contracts without
moving current app code.

### Phase 1: Monorepo Foundation

Introduce pnpm workspace layout, package boundaries, lint/type/test scripts, and
root documentation. Move the current app to `apps/mobile` only when workspace
tests can prove behavior is preserved.

### Phase 2: Backend Skeleton

Create API, domain contracts, local database schema, and auth/account skeletons.

### Phase 3: Core Product MVP

Implement contacts, trust items, trigger policy, simulation, and secure vault
metadata. Keep irreversible execution disabled or manually reviewed.

### Phase 4: Trigger and Review Workflows

Implement trigger engine, notification orchestration, review queues, audit, and
admin operations.

### Phase 5: Production Hardening

Add encryption operations, backup/restore, monitoring, incident runbooks, data
retention, release gates, and compliance review artifacts.

## Future OpenFlow Decomposition

This plan should spawn smaller implementation changes:

- `setup-pnpm-monorepo-workspace`
- `move-mobile-app-to-apps-mobile`
- `add-domain-contract-package`
- `add-api-contract-package`
- `add-trigger-state-machine-contracts`
- `add-secure-vault-architecture`
- `add-review-admin-architecture`
- `add-operations-security-docs`

Each future change should have its own proposal/spec/build cycle.
