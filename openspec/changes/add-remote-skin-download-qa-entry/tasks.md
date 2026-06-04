# Tasks

## 1. Define remote QA fixture flow

- [ ] Add a focused remote skin QA harness or helper for testable end-to-end
      flow.
- [ ] Define fixture inputs for manifest, asset content, and expected failure
      variants.
- [ ] Reuse the skin package publishing helper or command to prepare valid
      fixture hashes.
- [ ] Keep fixture preparation local-only and data-only.

## 2. Exercise remote adapter and downloader integration

- [ ] Build a valid remote-style fixture through the QA harness.
- [ ] Stage the fixture through `createRemoteSkinPackageSource`.
- [ ] Download it through `downloadSkinPackage`.
- [ ] Assert `ready` promotion, active skin id, last-ready skin id, and package
      state.
- [ ] Assert runtime storage semantics use downloader abstractions rather than
      project-root `skins/` as runtime storage.

## 3. Cover recoverable validation failures

- [ ] Add a stale package hash QA case.
- [ ] Add a stale asset hash QA case.
- [ ] Assert failed package state and validation reason.
- [ ] Assert previous active and last-ready skins remain unchanged.
- [ ] Assert no partial package becomes ready.

## 4. Verify status UI boundary

- [ ] Add or update My/settings status tests for QA ready state.
- [ ] Add or update My/settings status tests for QA failed state.
- [ ] Keep page tests using props or store-backed data only.
- [ ] Ensure page components do not import downloader or remote adapter
      internals.

## 5. Add command/docs and final verification

- [ ] Add a thin QA command or document the test harness command.
- [ ] Document how developers run the QA flow locally.
- [ ] Run `pnpm test tests/skin/remote-download-qa.test.ts --runInBand`.
- [ ] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [ ] Run `pnpm test tests/skin --runInBand`.
- [ ] Run `pnpm check:type`.
- [ ] Run `npm.cmd exec -- openspec validate add-remote-skin-download-qa-entry --strict`.
- [ ] Run `git diff -- .ai`.
