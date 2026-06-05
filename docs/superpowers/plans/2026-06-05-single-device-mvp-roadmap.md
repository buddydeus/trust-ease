# Single Device App MVP Roadmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring Trust Ease from a polished Expo prototype and skin-runtime foundation to a single-device MVP where a user can create, review, simulate, and locally safeguard an emergency handoff plan without any backend dependency.

**Architecture:** Keep the MVP local-first. Persist product data through AsyncStorage-backed store modules, keep Expo Router files thin, render user workflows through `src/pages/*`, and reserve remote skin support as optional styling infrastructure rather than the product backbone. Each phase should be opened as its own OpenFlow/OpenSpec change, implemented, verified, closed, and committed before starting the next phase.

**Tech Stack:** Expo 55, Expo Router, React Native 0.85, React 19, TypeScript strict mode, Zustand, AsyncStorage, React Hook Form, Zod, Jest, React Native Testing Library, OpenSpec/OpenFlow.

---

## MVP Definition

The standalone MVP is complete when one person can install the app on one device and:

- pass welcome/onboarding once, then return directly to the normal app flow;
- create, edit, archive, and inspect local important items;
- add at least one trusted helper/contact and assign helpers to items;
- configure a reversible local trigger/check-in policy and run a simulation without triggering irreversible execution;
- see a clear local readiness/status summary;
- export and import an encrypted or clearly user-controlled local backup file;
- pass the local QA gate without network, backend, or remote code execution.

Non-goals for this MVP:

- backend accounts, sync, push notification delivery, or multi-device merge;
- real legal execution, notarization, or third-party account takeover;
- remote arbitrary React/JavaScript/plugin execution;
- monorepo physical split before the standalone product loop is stable.

## Phase Commit Rule

Every phase below ends the same way:

1. Run the phase-specific verification commands.
2. Run `npm.cmd exec -- openspec validate --all --strict`.
3. Confirm `git diff -- .ai` is empty unless the user explicitly requested `.ai/` changes.
4. Execute `/commit-helper` and commit the phase.
5. Report the commit hash and the exact next OpenFlow command to start the next phase.

## Phase 1: Local Trust Data Model

Suggested OpenFlow change: `add-local-trust-item-data-model`

**Goal:** Define the local data contracts and persistence helpers that future UI workflows will use.

**Files:**
- Create: `src/store/trust/types.ts`
- Create: `src/store/trust/storage.ts`
- Create: `src/store/trust/defaults.ts`
- Create: `tests/store/trust/storage.test.ts`
- Modify: `src/store/index.ts` or current store barrel if present

- [ ] **Step 1: Propose the change**

Run:

```bash
npm.cmd exec -- openspec list
```

Then start:

```text
/openflow proposal add-local-trust-item-data-model
```

The proposal must require local-only persistence, schema versioning, safe parse fallback, and no backend dependency.

- [ ] **Step 2: Specify the data contract**

Run:

```text
/openflow spec add-local-trust-item-data-model
```

The spec should cover item fields, helper/contact fields, trigger policy fields, audit metadata, migration/version behavior, and corrupted storage fallback.

- [ ] **Step 3: Implement with tests first**

Add storage tests that prove:

- missing storage returns a default snapshot;
- malformed JSON returns a default snapshot and does not throw;
- saved snapshots round-trip through AsyncStorage;
- unknown future versions do not crash;
- archived items remain stored but are excluded from active selectors.

- [ ] **Step 4: Verify Phase 1**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-trust-item-data-model
/commit-helper
```

Next phase after commit: `add-local-item-crud-workflow`.

## Phase 2: Local Item CRUD Workflow

Suggested OpenFlow change: `add-local-item-crud-workflow`

**Goal:** Make the Items and New Item screens operate on real local data instead of static sample copy.

**Files:**
- Modify: `src/app/(tabs)/items.tsx`
- Modify: `src/app/items/new.tsx`
- Modify: `src/pages/items/ItemsScreen.tsx`
- Modify: `src/pages/items/ItemFormScreen.tsx`
- Modify: `src/pages/items/types.ts` if present, or create it beside the page
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Create or modify: `tests/pages/items/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-local-item-crud-workflow
/openflow spec add-local-item-crud-workflow
```

The spec must require create, edit, archive, validation errors, empty state, active/archived filtering, and tri-language copy.

- [ ] **Step 2: Add failing page tests**

Tests should prove:

- empty state renders when no active items exist;
- creating an item writes to local store and returns to the items list;
- item detail/edit flow can update title, kind, summary, and helper assignment placeholders;
- archive does not hard-delete the item;
- validation blocks empty title and unsafe high-pressure copy.

- [ ] **Step 3: Implement the UI and route wiring**

Keep `src/app/*` route files focused on routing, i18n copy, and store binding. Keep form layout and validation UI in `src/pages/items/*`.

- [ ] **Step 4: Verify Phase 2**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-item-crud-workflow
/commit-helper
```

Next phase after commit: `add-local-helper-contact-workflow`.

## Phase 3: Local Helper Contact Workflow

Suggested OpenFlow change: `add-local-helper-contact-workflow`

**Goal:** Let the user record trusted helpers/contacts locally and understand what each helper is expected to do.

**Files:**
- Create or modify: `src/pages/helpers/*`
- Create or modify route: `src/app/helpers/*` or a page entry following current routing conventions
- Modify: `src/store/trust/*`
- Modify: `src/pages/items/*`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Create: `tests/pages/helpers/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-local-helper-contact-workflow
/openflow spec add-local-helper-contact-workflow
```

The spec must require name, relationship, contact method, notes, item assignment, and clear language that the app is not sending messages or executing legal handoff by itself.

- [ ] **Step 2: Add tests**

Tests should cover creating a helper, editing helper details, assigning a helper to an item, and showing helper expectations in user-friendly language.

- [ ] **Step 3: Implement**

Favor a compact local helper screen or modal-like page that fits the existing mobile UI. Avoid adding network permission or address-book integration in this MVP phase.

- [ ] **Step 4: Verify Phase 3**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/helpers --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-helper-contact-workflow --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-helper-contact-workflow
/commit-helper
```

Next phase after commit: `add-local-trigger-policy-simulation`.

## Phase 4: Local Trigger Policy Simulation

Suggested OpenFlow change: `add-local-trigger-policy-simulation`

**Goal:** Turn the current trigger-state prototype into a reversible local policy and simulation workflow.

**Files:**
- Modify: `src/app/my/trigger-state.tsx`
- Modify: `src/pages/trigger-state/TriggerStateScreen.tsx`
- Modify: `src/store/reporting/actions.ts`
- Modify: `src/store/trust/*`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Create or modify: `tests/pages/trigger-state/*`
- Create or modify: `tests/store/reporting/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-local-trigger-policy-simulation
/openflow spec add-local-trigger-policy-simulation
```

The spec must require reversible state, no irreversible execution, explicit explanation before risky actions, and report/check-in semantics shared with the existing report page.

- [ ] **Step 2: Add tests**

Tests should prove:

- report page and welcome-start check-in share the same formal report semantics;
- trigger policy can be changed and persisted;
- missed check-in simulation shows warning/escalation states without executing handoff;
- disabling simulation returns to normal state.

- [ ] **Step 3: Implement**

Keep the product language calm. Use “失联托付”“预警”“模拟演练” instead of making a single missed check-in feel final.

- [ ] **Step 4: Verify Phase 4**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/app/welcome-route.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-trigger-policy-simulation --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-trigger-policy-simulation
/commit-helper
```

Next phase after commit: `add-local-readiness-summary`.

## Phase 5: Local Readiness Summary

Suggested OpenFlow change: `add-local-readiness-summary`

**Goal:** Make the Home/My surfaces tell the user whether the local plan is usable, incomplete, or needs attention.

**Files:**
- Modify: `src/app/(tabs)/home.tsx`
- Modify: `src/pages/home/HomeScreen.tsx`
- Modify: `src/app/(tabs)/my.tsx`
- Modify: `src/pages/my/MyScreen.tsx`
- Modify: `src/store/trust/*`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Create or modify: `tests/pages/home/*`
- Create or modify: `tests/pages/my/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-local-readiness-summary
/openflow spec add-local-readiness-summary
```

The spec must define readiness states such as no items, missing helper, trigger policy incomplete, ready for local rehearsal, and backup recommended.

- [ ] **Step 2: Add tests**

Tests should cover readiness summaries for empty, partial, and complete local plans.

- [ ] **Step 3: Implement**

Home should prioritize the next useful action. My can expose the more technical runtime/status details that already exist.

- [ ] **Step 4: Verify Phase 5**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/home --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-readiness-summary --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-readiness-summary
/commit-helper
```

Next phase after commit: `add-local-backup-export-import`.

## Phase 6: Local Backup Export and Import

Suggested OpenFlow change: `add-local-backup-export-import`

**Goal:** Provide a local backup path so a single-device MVP is not fragile if the app is reinstalled or the user switches devices manually.

**Files:**
- Create: `src/store/trust/backup.ts`
- Modify: `src/store/trust/types.ts`
- Modify: `src/pages/my/*`
- Modify: `src/app/(tabs)/my.tsx`
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Create: `tests/store/trust/backup.test.ts`
- Create or modify: `tests/pages/my/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-local-backup-export-import
/openflow spec add-local-backup-export-import
```

The spec must require versioned export format, import validation, clear user-controlled file language, and no silent cloud upload.

- [ ] **Step 2: Add tests**

Tests should prove backup export includes schema version and trust data, import rejects malformed files, import rejects unsupported future versions, and successful import replaces local trust data only after explicit confirmation.

- [ ] **Step 3: Implement**

Use a deterministic JSON backup format first. If encryption is not implemented in this phase, the UI must clearly say the file is user-controlled and should be stored carefully; do not imply it is encrypted.

- [ ] **Step 4: Verify Phase 6**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-backup-export-import --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-local-backup-export-import
/commit-helper
```

Next phase after commit: `add-single-device-mvp-qa-gate`.

## Phase 7: Single Device MVP QA Gate

Suggested OpenFlow change: `add-single-device-mvp-qa-gate`

**Goal:** Turn the current manual QA list into a repeatable local MVP verification gate.

**Files:**
- Modify: `package.json`
- Create or modify: `scripts/*`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Create or modify: `tests/support/*`

- [ ] **Step 1: Propose and spec**

Run:

```text
/openflow proposal add-single-device-mvp-qa-gate
/openflow spec add-single-device-mvp-qa-gate
```

The spec should define `pnpm check:qa` or equivalent scripts for type, i18n, Jest, skin remote QA, screenshots, and OpenSpec validation.

- [ ] **Step 2: Add script-level tests where practical**

Use existing support tests to assert script names and command intent. Avoid duplicating all command internals in tests.

- [ ] **Step 3: Implement scripts and docs**

Document that `thumbs` must remain a real Expo Web bundle screenshot path and cannot fall back to design previews.

- [ ] **Step 4: Verify Phase 7**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:qa
npm.cmd exec -- openspec validate add-single-device-mvp-qa-gate --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [ ] **Step 5: Close and commit**

Run:

```text
/openflow close add-single-device-mvp-qa-gate
/commit-helper
```

Next phase after commit: reassess whether to start monorepo physical split or backend-connected app planning.

## Execution Order

Do not start Phase 2 before Phase 1 is closed and committed. Each later phase depends on the contracts from previous phases:

```text
local data model
-> item CRUD
-> helpers/contacts
-> trigger simulation
-> readiness summary
-> backup/export/import
-> MVP QA gate
```

Monorepo physical split should wait until after Phase 7 unless there is a separate product reason to split earlier. The MVP has more risk in local product behavior than in package layout right now.

## Next Immediate Command

Start here:

```text
/openflow proposal add-local-trust-item-data-model
```

Then follow Phase 1 through close and `/commit-helper` before opening Phase 2.
