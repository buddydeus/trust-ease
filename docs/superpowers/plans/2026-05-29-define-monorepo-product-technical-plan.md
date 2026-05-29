# Define Monorepo Product Technical Plan Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a human-facing product-to-technology documentation set that explains how Trust Ease grows from the current Expo prototype into a monorepo product system.

**Architecture:** This change is documentation-only. It creates `docs/product`, `docs/architecture`, `docs/security`, and `docs/operations` files that are traceable to `openspec/changes/define-monorepo-product-technical-plan`. It must not move current app code or modify `.ai/`.

**Tech Stack:** Markdown, OpenSpec, pnpm workspace planning, TypeScript-first architecture.

---

### Task 1: Product And Architecture README Set

**Files:**
- Create: `docs/product/README.md`
- Create: `docs/architecture/README.md`
- Create: `docs/security/README.md`
- Create: `docs/operations/README.md`

- [x] **Step 1: Create product README**

Create `docs/product/README.md` with product position, non-goals, roles, core flows, and MVP boundaries from the PRD.

- [x] **Step 2: Create architecture README**

Create `docs/architecture/README.md` with target monorepo layout, domain boundaries, service boundaries, and shared package rules.

- [x] **Step 3: Create security README**

Create `docs/security/README.md` with baseline security, compliance, permissions, encryption, audit, mis-trigger prevention, freeze, and appeal strategy.

- [x] **Step 4: Create operations README**

Create `docs/operations/README.md` with testing, environments, releases, observability, backup/restore, and future OpenFlow decomposition.

- [x] **Step 5: Verify no `.ai` edits**

Run: `git diff -- .ai`
Expected: no output.

### Task 2: Monorepo Organization Plan

**Files:**
- Create: `docs/architecture/monorepo.md`

- [x] **Step 1: Document target workspace tree**

Write the future `apps/`, `services/`, `packages/`, `infra/`, and `docs/` tree.

- [x] **Step 2: Document app and service boundaries**

Describe `apps/mobile`, `apps/admin`, `apps/contact-portal`, `services/api`, `services/worker`, and `services/integrations`.

- [x] **Step 3: Document package boundaries**

Describe `packages/domain`, `packages/api-contracts`, `packages/config`, `packages/i18n`, `packages/ui`, and `packages/testing`.

- [x] **Step 4: Document migration rules**

State that this build does not move current code and that mobile migration requires a later OpenFlow change.

### Task 3: Product Domain And API Boundary Plan

**Files:**
- Create: `docs/architecture/product-domains.md`
- Create: `docs/architecture/api-boundaries.md`

- [x] **Step 1: Document bounded contexts**

Write the ten domains: identity/account, contact/authorization, trust items, secure vault, trigger engine, notification orchestration, execution routing, review/risk control, audit/compliance, client experience.

- [x] **Step 2: Document aggregate roots**

Write aggregate roots including `UserAccount`, `IdentityVerification`, `TrustedContact`, `AuthorizationGrant`, `TrustItem`, `VaultDocument`, `TriggerPolicy`, `TriggerIncident`, `NotificationAttempt`, `ExecutionTask`, `ReviewCase`, and `AuditEvent`.

- [x] **Step 3: Document state machines**

Write plan lifecycle, trigger lifecycle, vault release lifecycle, and execution task lifecycle.

- [x] **Step 4: Document API groups**

Write API groups for auth, account, contacts, authorizations, items, vault, trigger-policy, trigger-incidents, notifications, execution-tasks, review, audit, and skins.

### Task 4: Security And Risk-Control Plan

**Files:**
- Create: `docs/security/baseline.md`
- Create: `docs/security/threat-model.md`

- [x] **Step 1: Document sensitive-domain non-goals**

Write that Trust Ease does not replace wills, notarization, legal advice, plaintext third-party password custody, or complete account/asset takeover promises.

- [x] **Step 2: Document least privilege**

Write contact, executor, partner, reviewer, and service-role access boundaries.

- [x] **Step 3: Document encryption and audit**

Write vault encryption, envelope encryption consideration, and immutable audit event requirements.

- [x] **Step 4: Document mis-trigger prevention**

Write pre-alert, contact verification, pending review, manual gate, freeze, and appeal controls.

### Task 5: Operations And Delivery Roadmap

**Files:**
- Create: `docs/operations/delivery-roadmap.md`
- Create: `docs/operations/testing-strategy.md`

- [x] **Step 1: Document delivery phases**

Write Phase 0 through Phase 5: planning/contracts, monorepo foundation, backend skeleton, core product MVP, trigger/review workflows, production hardening.

- [x] **Step 2: Document future OpenFlow changes**

Write follow-up changes: `setup-pnpm-monorepo-workspace`, `move-mobile-app-to-apps-mobile`, `add-domain-contract-package`, `add-api-contract-package`, `add-trigger-state-machine-contracts`, `add-secure-vault-architecture`, `add-review-admin-architecture`, `add-operations-security-docs`.

- [x] **Step 3: Document testing layers**

Write domain unit, API contract, service integration, worker fake clock, client route/page, E2E smoke, and security regression tests.

- [x] **Step 4: Document production operations**

Write structured logs, metrics, traces, alerts, backup/restore, retention, migration, rollback, feature flags, and environment separation.

### Task 6: Validation

**Files:**
- None

- [x] **Step 1: Validate OpenSpec**

Run: `npm.cmd exec -- openspec validate define-monorepo-product-technical-plan --strict`
Expected: `Change 'define-monorepo-product-technical-plan' is valid`.

- [x] **Step 2: Verify `.ai` unchanged**

Run: `git diff -- .ai`
Expected: no output.

- [x] **Step 3: Verify app source unchanged**

Run: `git diff -- src tests scripts skins package.json`
Expected: no output.

- [x] **Step 4: Scan placeholders**

Run: `Select-String -Path 'docs/**/*.md' -Pattern 'TODO|TBD|implement later|similar to above' -CaseSensitive`
Expected: no output.
