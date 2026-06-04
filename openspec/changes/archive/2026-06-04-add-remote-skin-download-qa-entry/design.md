# Design: Add Remote Skin Download QA Entry

## Overview

The current skin runtime has validated pieces for local package publishing,
remote source staging, package validation, ready promotion, fallback behavior,
and status UI. This change adds an internal QA/dev flow that proves those pieces
work together without introducing a user-facing skin store.

The preferred shape is a testable harness plus a thin command or script. The
harness should exercise the same runtime modules used by the app, while keeping
routes and page components free of downloader implementation details.

## Key Decisions

### Keep the Entry Internal and Developer-Oriented

This QA entry is not a product feature. It should be available to developers or
future CI, not presented as a normal settings screen for users.

Acceptable implementation shapes:

- a script such as `scripts/remote_skin_qa.*`;
- a package command such as `pnpm skin:remote-qa`;
- focused tests that run the same harness;
- optional docs in `README.md`, `AGENTS.md`, or `TODO.md`.

Avoid adding a public skin marketplace, remote index service, or broad settings
UI in this change.

### Reuse Local Publishing Tooling for Fixtures

The QA fixture should be prepared with the same package publishing contract used
by local skin packages. That keeps asset hashes and canonical package hashes in
sync with app runtime expectations.

The flow can either:

- use a committed fixture whose manifest has already been updated by the
  publishing tool; or
- generate a temporary fixture during tests or scripts and run the publishing
  helper before staging.

### Exercise Remote Adapter and Downloader Together

The QA flow should not stop at unit-testing the remote adapter. It should prove
that a remote-style manifest and assets can flow through:

```text
remote descriptor -> remote source adapter -> downloadSkinPackage -> ready state
```

The flow may use dependency-injected fetch/file-system adapters or a local test
server. Dependency injection is preferred for deterministic tests.

### Verify Recoverable Failures

The QA flow should explicitly cover stale package hash or stale asset hash
failure. A failed QA package must not replace the previous ready skin and must
leave package state in a recoverable failed state.

### Verify Status Surface Through Existing Boundaries

Status UI verification should use existing My/settings props or store-backed
state boundaries. Page components should not import downloader, remote adapter,
or publishing helper internals.

If new QA-only labels are needed, they must stay internal or be added with
complete `zh-CN`, `zh-TW`, and `en-US` localization.

## Compatibility

- Runtime storage remains under Expo FileSystem `documentDirectory/skins/`.
- Project-root `skins/` remains a build-time bundled source or local fixture
  input, not mobile runtime storage.
- Remote packages remain data-only: manifest plus declared static assets.
- Existing downloader and remote adapter behavior should be reused rather than
  bypassed.
- Existing publishing tooling remains local-only and should not fetch remote
  files.

## Validation Strategy

Focused tests should cover:

- valid QA fixture prepares and downloads to `ready`;
- stale asset hash or package hash fails recoverably;
- previous active and last-ready skin remain usable after failure;
- My/settings status surface can display ready/failed state from the QA flow;
- no route/page component imports downloader or remote adapter internals.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-download-qa.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-remote-skin-download-qa-entry --strict
```
