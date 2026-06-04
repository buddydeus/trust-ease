# add-skin-package-hash-canonicalization Build Plan

## Source

- Proposal: `openspec/changes/add-skin-package-hash-canonicalization/proposal.md`
- Design: `openspec/changes/add-skin-package-hash-canonicalization/design.md`
- Specs: `openspec/changes/add-skin-package-hash-canonicalization/specs/`
- Tasks: `openspec/changes/add-skin-package-hash-canonicalization/tasks.md`

## Implementation

- [x] Add `src/skin/packageHash.ts` as the canonical skin package hash helper.
- [x] Define typed package hash inputs for skin identity, manifest source, and file entries.
- [x] Normalize package paths to slash-separated relative paths.
- [x] Reject empty, traversal, absolute, duplicate, and URL-like package paths.
- [x] Canonicalize manifest objects with recursive sorted keys.
- [x] Omit manifest `packageHash` from canonical manifest input to avoid self-referential hashing.
- [x] Keep a stable algorithm prefix in produced package hashes.

## Tests

- [x] Add `tests/skin/package-hash.test.ts`.
- [x] Cover Windows and POSIX path separator equivalence.
- [x] Cover deterministic file entry sorting.
- [x] Cover deterministic manifest property ordering.
- [x] Cover invalid path rejection.
- [x] Cover manifest `packageHash` neutralization.
- [x] Update `tests/skin/remote-source-adapter.test.ts` for canonical default package hashing.

## Integration

- [x] Wire `src/skin/remoteSourceAdapter.ts` to use the canonical helper when a descriptor omits `packageHash`.
- [x] Preserve descriptor-level explicit `packageHash` behavior.
- [x] Preserve the remote adapter as data-only manifest and static asset handling.
- [x] Preserve downloader and validation failure semantics.

## Verification

- [x] `pnpm test tests/skin/package-hash.test.ts --runInBand`
- [x] `pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`
- [x] `pnpm test tests/skin/package-validation.test.ts --runInBand`
- [x] `pnpm test tests/skin/downloader.test.ts --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
- [x] `npm.cmd exec -- openspec validate add-skin-package-hash-canonicalization --strict`
- [x] `git diff --check`
- [x] `git diff -- .ai`
