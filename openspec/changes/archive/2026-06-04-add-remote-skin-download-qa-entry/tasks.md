# Tasks

## 1. Define remote QA fixture flow

- [x] Add a focused remote skin QA harness or helper for testable end-to-end
      flow.
- [x] Define fixture inputs for manifest, asset content, and expected failure
      variants.
- [x] Reuse the skin package publishing helper or command to prepare valid
      fixture hashes.
- [x] Keep fixture preparation local-only and data-only.

## 2. Exercise remote adapter and downloader integration

- [x] Build a valid remote-style fixture through the QA harness.
- [x] Stage the fixture through `createRemoteSkinPackageSource`.
- [x] Download it through `downloadSkinPackage`.
- [x] Assert `ready` promotion, active skin id, last-ready skin id, and package
      state.
- [x] Assert runtime storage semantics use downloader abstractions rather than
      project-root `skins/` as runtime storage.

## 3. Cover recoverable validation failures

- [x] Add a stale package hash QA case.
- [x] Add a stale asset hash QA case.
- [x] Assert failed package state and validation reason.
- [x] Assert previous active and last-ready skins remain unchanged.
- [x] Assert no partial package becomes ready.

## 4. Verify status UI boundary

- [x] Add or update My/settings status tests for QA ready state.
- [x] Add or update My/settings status tests for QA failed state.
- [x] Keep page tests using props or store-backed data only.
- [x] Ensure page components do not import downloader or remote adapter
      internals.

## 5. Add command/docs and final verification

- [x] Add a thin QA command or document the test harness command.
- [x] Document how developers run the QA flow locally.
- [x] Run `pnpm test tests/skin/remote-download-qa.test.ts --runInBand`.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm check:type`.
- [x] Run `npm.cmd exec -- openspec validate add-remote-skin-download-qa-entry --strict`.
- [x] Run `git diff -- .ai`.
