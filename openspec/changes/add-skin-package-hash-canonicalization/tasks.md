# Tasks

## 1. Add canonical package hash helper

- [x] Add a focused skin runtime helper for package hash canonicalization.
- [x] Define explicit input types for manifest data, package identity, and file
      entries.
- [x] Normalize package paths to slash-separated relative paths.
- [x] Reject empty, traversal, absolute, or URL-like package paths.
- [x] Serialize manifest/package data with deterministic key ordering.
- [x] Omit or otherwise neutralize manifest `packageHash` in canonical manifest
      input to avoid self-referential hashing.

## 2. Add package hash tests

- [x] Cover Windows and POSIX path separator equivalence.
- [x] Cover deterministic file ordering.
- [x] Cover deterministic manifest property ordering.
- [x] Cover invalid path rejection.
- [x] Cover package hash strings with a stable algorithm prefix.
- [x] Run `pnpm test tests/skin/package-hash.test.ts --runInBand`.

## 3. Wire remote adapter to canonical hash

- [x] Replace the remote adapter's ad hoc default package hash fallback with the
      canonical helper.
- [x] Preserve descriptor-level explicit package hash behavior.
- [x] Keep remote adapter data-only and free of remote code execution.
- [x] Update remote adapter tests for canonical default hash behavior.
- [x] Run `pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`.

## 4. Preserve validation and downloader behavior

- [x] Ensure package hash mismatch still returns `package-hash-mismatch`.
- [x] Ensure package hash calculation failures prevent `ready` promotion.
- [x] Ensure previous active and last-ready skins remain usable after mismatch
      or calculation failure.
- [x] Run `pnpm test tests/skin/package-validation.test.ts --runInBand`.
- [x] Run `pnpm test tests/skin/downloader.test.ts --runInBand`.

## 5. Final verification

- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `npm.cmd exec -- openspec validate add-skin-package-hash-canonicalization --strict`.
- [x] Run `git diff -- .ai`.
