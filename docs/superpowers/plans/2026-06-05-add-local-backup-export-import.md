# Local Backup Export Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Use TDD for behavior changes: write focused failing tests, verify RED, implement, then verify GREEN.

**Goal:** Build a local-only backup export/import workflow for the standalone MVP so users can export the current trust snapshot and import a validated backup after preview and explicit confirmation.

**Architecture:** Add pure backup serialization/parsing helpers under `src/store/trust`, keep platform file IO behind an injectable adapter/controller boundary, render a prop-driven backup section on the My surface, and let the My route bind i18n, storage, adapter calls, preview state, confirmation, and cancellation. No cloud sync, backend, account restore, remote code, or skin package import/export is introduced.

**Tech Stack:** Expo Router, React Native, TypeScript, styled-components, AsyncStorage trust snapshot helpers, Expo FileSystem, Jest, React Native Testing Library, OpenSpec.

---

## File Structure

- Create `tests/store/trust/backup.test.ts`: export/import envelope and preview tests.
- Create `src/store/trust/backup.ts`: backup constants, envelope types, serialization, parsing, preview helpers, controller helpers if useful.
- Modify `src/store/trust/index.ts`: export backup APIs.
- Modify `tests/pages/my/my-screen.test.tsx`: backup UI and route/controller coverage.
- Modify `tests/pages/my/my-screen.i18n.test.tsx`: backup copy coverage.
- Modify `src/pages/my/types.ts`: backup UI props and copy types.
- Modify `src/pages/my/MyScreen.tsx`: render backup entry, actions, preview, errors, confirmation.
- Modify `src/pages/my/my.styled.tsx`: reuse compact settings card styling and add backup-specific layout if needed.
- Modify `src/app/(tabs)/my.tsx`: wire i18n, backup state, load/save trust snapshot, file adapter calls, and callbacks.
- Modify `src/locals/zh-CN.json`, `src/locals/zh-TW.json`, `src/locals/en-US.json`: backup workflow copy.
- Modify `openspec/changes/add-local-backup-export-import/tasks.md`: mark tasks complete after verification.

### Task 1: Backup Serialization And Parsing

**Files:**
- Create: `tests/store/trust/backup.test.ts`
- Create: `src/store/trust/backup.ts`
- Modify: `src/store/trust/index.ts`

- [x] **Step 1: Write failing backup helper tests**

Cover versioned export envelope, invalid source snapshot rejection, malformed JSON rejection, invalid envelope rejection, unsupported backup/trust versions, preview counts, trigger summary, and no mutation of input snapshot.

- [x] **Step 2: Run helper tests and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand`

Expected: FAIL because backup helper exports do not exist yet.

- [x] **Step 3: Implement minimal backup helpers**

Create `src/store/trust/backup.ts` with constants, types, `serializeLocalTrustBackup`, `parseLocalTrustBackup`, and `deriveLocalTrustBackupPreview`. Reuse `parseTrustDataSnapshot` and do not mutate snapshots.

- [x] **Step 4: Run helper tests and verify GREEN**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand`

Expected: PASS.

### Task 2: Adapter And Controller Boundary

**Files:**
- Modify: `src/store/trust/backup.ts`
- Modify: `tests/store/trust/backup.test.ts`

- [x] **Step 1: Write failing controller tests**

Cover export success, export write failure, import preview success, import cancellation, import read failure, import validation failure, confirm import success, and cancel preserving current data using injected load/save/adapter functions.

- [x] **Step 2: Run controller tests and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand`

Expected: FAIL because controller helpers do not exist yet.

- [x] **Step 3: Implement minimal controller helpers**

Add injectable helpers such as `exportLocalTrustBackup`, `previewLocalTrustBackupImport`, and `confirmLocalTrustBackupImport`. Keep file IO dependency injected and return explicit result states.

- [x] **Step 4: Run controller tests and verify GREEN**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/backup.test.ts --runInBand`

Expected: PASS.

### Task 3: My Backup UI And Route Wiring

**Files:**
- Modify: `tests/pages/my/my-screen.test.tsx`
- Modify: `tests/pages/my/my-screen.i18n.test.tsx`
- Modify: `src/pages/my/types.ts`
- Modify: `src/pages/my/MyScreen.tsx`
- Modify: `src/pages/my/my.styled.tsx`
- Modify: `src/app/(tabs)/my.tsx`

- [x] **Step 1: Write failing UI and route tests**

Assert My page renders backup entry/copy/actions, export callback fires, import preview renders counts and replacement warning, cancel and confirm callbacks fire, route preview does not write storage, and confirmed import writes the parsed snapshot.

- [x] **Step 2: Run My tests and verify RED**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand`

Expected: FAIL because backup props/UI/route wiring do not exist yet.

- [x] **Step 3: Implement prop-driven UI and route state**

Extend `MyScreen` with backup props and copy; wire My route to backup helper/controller callbacks; use a minimal injected/default adapter for current platform support and testability.

- [x] **Step 4: Run My tests and verify GREEN**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand`

Expected: PASS.

### Task 4: Localization, Verification, And Task Sync

**Files:**
- Modify: `src/locals/zh-CN.json`
- Modify: `src/locals/zh-TW.json`
- Modify: `src/locals/en-US.json`
- Modify: `openspec/changes/add-local-backup-export-import/tasks.md`

- [x] **Step 1: Add three-locale backup copy**

Add all backup workflow titles, summaries, actions, statuses, previews, confirmation, errors, and local-only warnings in `zh-CN`, `zh-TW`, and `en-US`.

- [x] **Step 2: Run required checks**

Run:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec -- openspec validate add-local-backup-export-import --strict
npm.cmd exec -- openspec validate --all --strict
git diff -- .ai
```

- [x] **Step 3: Mark OpenSpec and plan tasks complete**

Update `openspec/changes/add-local-backup-export-import/tasks.md` and this plan only after matching implementation and verification pass.

- [x] **Step 4: Commit build result**

Use `/commit-helper` rules with scoped staging and a multiline commit message.
