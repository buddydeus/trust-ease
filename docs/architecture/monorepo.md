# Monorepo Plan

This is the target organization for the product system. It is not the current
file layout and should be implemented through later OpenFlow changes.

## Target Tree

```text
apps/
  mobile/
  admin/
  contact-portal/

services/
  api/
  worker/
  integrations/

packages/
  domain/
  api-contracts/
  config/
  i18n/
  ui/
  testing/

infra/
  local/
  deploy/
  observability/

docs/
  product/
  architecture/
  security/
  operations/
```

## Applications

### `apps/mobile`

Future home of the current Expo Router app. It owns the owner-facing mobile
experience: welcome, onboarding, home, trust items, trigger state, account
settings, i18n, and controlled skin rendering.

The move from root app to `apps/mobile` must happen in a later change and must
preserve current routes, tests, screenshot scripts, locale behavior, and skin
runtime semantics.

### `apps/admin`

Platform reviewer and operations console. It owns reviewer queues, evidence
review, risk flags, freezes, appeals, incident triage, and operational support.

Admin surfaces should not reuse mobile response shapes when reviewer permissions
or case context differ.

### `apps/contact-portal`

Trusted contact and executor portal. It owns invitation acceptance, identity
confirmation, authorized task viewing, released material access, and execution
progress.

The portal must default to "what should I do next?" rather than exposing raw
technical fields.

## Services

### `services/api`

Authenticated API and backend-for-frontend layer. It owns HTTP request
handling, session context, permission checks, transaction boundaries, and
response shaping for apps.

### `services/worker`

Background execution runtime. It owns trigger checks, notification fanout,
retry scheduling, delayed jobs, evidence review scheduling, and execution task
routing.

### `services/integrations`

Adapters for external systems, official process guidance, and partner routing.
It should hide third-party differences behind explicit internal contracts.

## Shared Packages

### `packages/domain`

Shared domain types, state-machine contracts, events, and pure domain rules.
This package should not know about HTTP, database clients, queues, or UI.

### `packages/api-contracts`

Request and response schemas. Prefer TypeScript-first schemas that can later
generate OpenAPI.

### `packages/config`

Typed runtime configuration, environment schemas, feature flags, and shared
constants.

### `packages/i18n`

Shared message keys and locale contracts once admin and contact portal appear.

### `packages/ui`

Reusable UI primitives after the mobile UI stabilizes. Do not prematurely move
screen-specific mobile components here.

### `packages/testing`

Fixtures, fake clocks, contract-test helpers, API client test utilities, and
domain scenario builders.

## Infrastructure

### `infra/local`

Local development dependencies such as database, queue, object storage emulator,
and mail/SMS stubs.

### `infra/deploy`

Environment definitions and deployment configuration.

### `infra/observability`

Logging, metrics, tracing, dashboard, and alert definitions.

## Workspace Strategy

- Use pnpm workspaces as the monorepo foundation.
- Keep TypeScript as the shared language across apps, services, contracts, and
  tests.
- Start with workspace scripts. Introduce a build orchestrator only when
  cross-package caching and task graph control are actually needed.
- Keep package boundaries explicit; shared packages must not become a junk
  drawer for service-specific business logic.

## Migration Rules

- This planning change does not move current code.
- Move the mobile app only in a later change with route, screenshot, i18n, and
  type-check verification.
- Migrate contracts before migrating backend behavior.
- Keep small changes independently reversible.
