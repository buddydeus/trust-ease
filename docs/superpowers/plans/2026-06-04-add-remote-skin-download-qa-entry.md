# Remote Skin Download QA Entry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an internal QA entry that proves a remote-style skin package can be prepared locally, staged through the remote adapter, validated by the downloader, surfaced through existing status UI, and fail recoverably.

**Architecture:** Keep the QA flow test-only and data-only. Reuse `runSkinPackagePublishing` to prepare canonical fixture hashes, `createRemoteSkinPackageSource` to mimic remote manifest/assets, and `downloadSkinPackage` to exercise runtime staging and promotion without adding a public skin store.

**Tech Stack:** TypeScript, Jest, Expo FileSystem mocks, existing skin publishing/downloader/runtime modules, React Native Testing Library page tests.

---

### Task 1: Remote QA Fixture Harness

**Files:**
- Create: `tests/skin/remote-download-qa.test.ts`

- [x] **Step 1: Write a test-local fixture builder**

Create a temporary package directory with `manifest.json`, `assets/logo.txt`, and `images/hero.txt`. The manifest starts with stale hashes so `runSkinPackagePublishing({ mode: 'update' })` must prepare valid asset hashes and package hash.

- [x] **Step 2: Assert fixture preparation is local-only**

The test should verify the package directory is under `os.tmpdir()` and no path uses the repository `skins/` runtime directory.

- [x] **Step 3: Run the focused QA test**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`

Expected before full implementation: the new file may fail until the remote adapter wiring assertions are complete.

### Task 2: Remote Adapter + Downloader Integration

**Files:**
- Modify: `tests/skin/remote-download-qa.test.ts`

- [x] **Step 1: Add a valid end-to-end QA case**

Build a descriptor with `manifestUrl` and `assetBaseUrl`, inject `fetchManifest` and `fetchAsset` dependencies that read from the prepared local fixture, then call `createRemoteSkinPackageSource`.

- [x] **Step 2: Download through `downloadSkinPackage`**

Call `downloadSkinPackage` with a mocked downloader file system and `currentFeatureVersion: coerceFeatureVersion('0.0')`.

- [x] **Step 3: Assert ready promotion**

Assert operation state is `ready`, active skin and last ready skin become `skin-qa-remote`, package state uses the `skinId@skinVersion` key, and promotion moves from `file:///app/document/skins/.staging/skin-qa-remote` to `file:///app/document/skins/skin-qa-remote`.

- [x] **Step 4: Run focused and skin suites**

Run:
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`

### Task 3: Recoverable Validation Failures

**Files:**
- Modify: `tests/skin/remote-download-qa.test.ts`

- [x] **Step 1: Add stale package hash case**

Use a valid prepared fixture, then inject a descriptor `packageHash: 'fnv1a:stale-package'` so the adapter reports a package hash mismatch.

- [x] **Step 2: Add stale asset hash case**

Use a manifest variant where one declared asset hash is stale while fetched content remains valid.

- [x] **Step 3: Assert recovery behavior**

For both cases, assert `operation.state` is `failed`, the failure reason is specific, `activeSkinId` and `lastReadySkinId` remain `skin-001`, and `fileSystem.move` is not called.

- [x] **Step 4: Run focused QA test**

Run: `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`

### Task 4: Status UI Boundary

**Files:**
- Modify: `tests/pages/my/my-screen.test.tsx`
- Verify: `src/pages/my/SkinRuntimeStatus.tsx`

- [x] **Step 1: Add ready QA status page test**

Render `MyScreen` with `skinRuntimeStatus.skinPackageStates` containing `skin-qa-remote@1.0.0: 'ready'` and assert the display name plus ready copy appears.

- [x] **Step 2: Add failed QA status page test**

Render `MyScreen` with a failed QA package state and assert the display name plus failed copy appears.

- [x] **Step 3: Verify import boundary**

Run source structure tests and inspect that page components do not import downloader, remote adapter, or publishing helper internals.

- [x] **Step 4: Run page and structure tests**

Run:
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`

### Task 5: Command, Docs, and Final Verification

**Files:**
- Modify: `package.json`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `openspec/changes/add-remote-skin-download-qa-entry/tasks.md`

- [x] **Step 1: Add a thin QA command**

Add `skin:qa:remote` that runs `jest tests/skin/remote-download-qa.test.ts --runInBand`.

- [x] **Step 2: Document local QA usage**

Document that the command exercises the local fixture, remote adapter, downloader, and status boundary without writing to Expo runtime storage or creating a public user-facing skin store.

- [x] **Step 3: Check off OpenSpec tasks**

Update the build-stage checkboxes in `openspec/changes/add-remote-skin-download-qa-entry/tasks.md`.

- [x] **Step 4: Run final verification**

Run:
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand`
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
`npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
`npm.cmd exec -- openspec validate add-remote-skin-download-qa-entry --strict`
`git diff -- .ai`
