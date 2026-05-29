# Tasks

## 1. Create product architecture documentation set

- [x] Add human-facing product and architecture documents under `docs/` that
      summarize the monorepo plan, product domains, state machines, API groups,
      security baseline, and delivery roadmap.
- [x] Keep `.ai/` unchanged and reference it only as planning input.
- [x] Verify docs mention current mobile stack and future monorepo boundaries.

## 2. Define monorepo workspace proposal

- [x] Document target `apps/`, `services/`, `packages/`, `infra/`, and `docs/`
      layout.
- [x] Document how the current root Expo app will later move to `apps/mobile`.
- [x] Document the package manager and TypeScript workspace strategy.

## 3. Define product domain model and API boundaries

- [x] Document bounded contexts and aggregate roots.
- [x] Document API group boundaries for mobile, admin, and contact portal use.
- [x] Document domain ownership rules and shared package limits.

## 4. Define security, compliance, and risk-control plan

- [x] Document sensitive-domain non-goals and custody boundaries.
- [x] Document least-privilege authorization rules.
- [x] Document encryption, vault release, audit, freeze, appeal, and
      mis-trigger prevention controls.

## 5. Define operations and delivery roadmap

- [x] Document testing strategy across client, packages, API, workers, security,
      and end-to-end flows.
- [x] Document production operations requirements for observability,
      backup/restore, migration, rollback, and release gates.
- [x] Document future OpenFlow change decomposition.

## 6. Validate OpenSpec and planning boundaries

- [x] Run `npm.cmd exec -- openspec validate define-monorepo-product-technical-plan --strict`.
- [x] Confirm `git diff -- .ai` is empty.
- [x] Confirm no application source code was modified by this planning change.
