# Add Skin Downloader Init State Machine Implementation Plan

> **For agentic workers:** Execute task-by-task. Keep progress in these
> checkboxes and update OpenSpec tasks only after verification passes.

**Goal:** Add a controlled downloaded skin package lifecycle and deterministic
startup resolver without changing current product behavior.

**Architecture:** Keep downloader, validation, and init decision logic under
`src/skin`; expose minimal state through `src/store`; keep `src/app` as hook
composition only; leave pages prop-driven.

---

### Task 1: Contracts

**Files:**
- Modify: `src/skin/types.ts`

- [x] Add package identity, operation result, init status, and failure reason
  types.
- [x] Run `pnpm check:type`.

### Task 2: Init State Machine

**Files:**
- Create: `src/skin/initStateMachine.ts`
- Create: `tests/skin/init-state-machine.test.ts`

- [x] Add cold start, persisted ready, missing active, failed selected,
  incompatible, and fallback tests.
- [x] Implement resolver.
- [x] Run focused test.

### Task 3: Package Validation

**Files:**
- Create: `src/skin/packageValidation.ts`
- Create: `tests/skin/package-validation.test.ts`

- [x] Add manifest, skin id, asset hash, package hash, and compatibility tests.
- [x] Implement validation helper.
- [x] Run focused test.

### Task 4: Downloader

**Files:**
- Create: `src/skin/downloader.ts`
- Modify: `src/skin/paths.ts`
- Create: `tests/skin/downloader.test.ts`

- [x] Add source, staging, validation, incompatible, and promotion tests.
- [x] Implement source adapter lifecycle.
- [x] Run focused test.

### Task 5: Store And Route Startup

**Files:**
- Modify: `src/store/useAppStore.ts`
- Modify: `src/app/useSkinStorageSync.ts`

- [x] Add minimal init status/outcome to store.
- [x] Delegate startup decision to skin init helper.
- [x] Run structure test and typecheck.

### Task 6: Page Behavior

**Files:**
- Modify only if needed: `src/pages/my/*`, `src/locals/*.json`

- [x] Preserve current My page behavior.
- [x] Run My page test.
- [x] Run locale check if text changes.

### Task 7: Final Verification

**Files:**
- Modify: `openspec/changes/add-skin-downloader-init-state-machine/tasks.md`

- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run structure test.
- [x] Run typecheck.
- [x] Confirm `.ai/` unchanged.
- [x] Mark OpenSpec tasks complete.
