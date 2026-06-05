# Local Trust Item Data Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a versioned AsyncStorage-backed local trust data snapshot for standalone MVP product workflows.

**Architecture:** Implement a focused `src/store/trust/` module with durable types, default snapshot creation, pure selectors, and storage helpers. Follow existing onboarding/skin storage patterns and keep all UI routes untouched in this change.

**Tech Stack:** TypeScript strict mode, AsyncStorage, Jest, existing Expo/React Native test setup.

---

### Task 1: Failing Storage and Selector Tests

**Files:**
- Create: `tests/store/trust/storage.test.ts`

- [x] **Step 1: Write tests for the desired public API**

Create tests that import `createDefaultTrustDataSnapshot`, `TRUST_DATA_SCHEMA_VERSION`, `loadTrustDataSnapshot`, `saveTrustDataSnapshot`, `clearTrustDataSnapshot`, `getActiveTrustItems`, `getArchivedTrustItems`, and `getActiveTrustedHelpers`.

- [x] **Step 2: Verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`

Expected before implementation: fail because `src/store/trust/*` does not exist.

### Task 2: Trust Types and Defaults

**Files:**
- Create: `src/store/trust/types.ts`
- Create: `src/store/trust/defaults.ts`
- Create: `src/store/trust/index.ts`
- Modify: `src/store/index.ts`

- [x] **Step 1: Define durable contracts**

Add schema version, item/helper status unions, item kind union, snapshot interface, item interface, helper interface, and trigger policy interface.

- [x] **Step 2: Add default snapshot factory**

Return empty `items` and `helpers`, conservative trigger defaults, and `updatedAt: null`.

- [x] **Step 3: Export trust module**

Expose the new trust module through `src/store/trust/index.ts` and root `src/store/index.ts`.

### Task 3: Selectors and AsyncStorage Persistence

**Files:**
- Create: `src/store/trust/selectors.ts`
- Create: `src/store/trust/storage.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Add pure selectors**

Implement active/archived trust item selectors and active helper selector with non-mutating filters.

- [x] **Step 2: Add storage helpers**

Implement namespaced AsyncStorage load/save/clear. Loading returns defaults for missing, malformed, invalid, missing-version, and unsupported-future-version data.

### Task 4: Verification and OpenSpec Task Updates

**Files:**
- Modify: `openspec/changes/add-local-trust-item-data-model/tasks.md`

- [x] **Step 1: Run focused tests**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`

- [x] **Step 2: Run type check**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`

- [x] **Step 3: Run OpenSpec checks**

Run:

```bash
npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [x] **Step 4: Mark OpenSpec tasks complete**

Check off `openspec/changes/add-local-trust-item-data-model/tasks.md` after implementation and verification pass.
