# Design: Add Skin Package Publishing Tooling

## Overview

The runtime already owns canonical package hash behavior in
`src/skin/packageHash.ts`. This change adds local developer tooling that prepares
or verifies a skin package directory with the same integrity contract before it
is served to the remote adapter or used as a QA fixture.

The tool is intentionally local and deterministic. It does not introduce a skin
marketplace, remote service, cryptographic signing, or any executable skin
extension model.

## Key Decisions

### Add a Tooling Helper Before the Script Entry Point

The package publishing rules should be testable without spawning a process.
Create a focused helper under `src/skin` or another existing project-owned
module boundary, then make the project script a thin entry point over that
helper.

Likely implementation shape:

- `src/skin/publishingTool.ts` or similarly named helper;
- `scripts/skin_package_tool.*` entry point;
- `tests/skin/publishing-tool.test.ts`.

The helper should expose check/update behavior through typed inputs and outputs
so tests can use in-memory or temporary directory fixtures.

### Reuse Runtime Canonical Hashing

The publishing tool must call `calculateSkinPackageHash` for package-level
hashes. It should not copy the canonicalization algorithm or define a second
hash contract.

The canonical package hash input should be assembled from:

- `skinId` and `skinVersion` from `manifest.json`;
- the manifest object with `packageHash` neutralized by the canonical helper;
- declared asset paths and their calculated asset hashes.

### Keep Asset Hashing Consistent With Remote Adapter Tests

The current remote adapter uses `fnv1a:<hex>` content hashes for static asset
fixtures. The first publishing tool should calculate asset content hashes with
the same project-local hash behavior already used by remote skin tests.

If a stronger asset digest is needed later, it should be introduced in a
separate migration change that updates both runtime and tooling expectations.

### Explicit Modes: Check and Update

The tool should support two modes:

- `check`: calculate current asset hashes and package hash, then fail if the
  manifest is stale;
- `update`: write calculated asset hashes and `packageHash` back to
  `manifest.json`.

Check mode should be suitable for CI and should not modify files. Update mode
is the only mode allowed to write the manifest.

### Safe Package Directory Semantics

The tool reads a local project skin package directory as an input source. It
does not treat that directory as mobile runtime storage and does not write into
Expo FileSystem runtime paths.

Asset paths should be validated as safe relative package paths before reading
files. Missing files, traversal paths, absolute paths, URL-like paths, and
duplicate normalized paths should fail with clear errors.

### Deterministic Manifest Output

When update mode writes `manifest.json`, the output should be deterministic
enough for version control review. The first implementation can preserve the
existing manifest object shape while updating only declared asset `hash` fields
and top-level `packageHash`.

If full manifest key canonical formatting is needed later, it can be handled in
a separate formatting change.

## Compatibility

- Existing bundled skin `skins/skin-001/manifest.json` may continue to use its
  current placeholder package hash unless the build task explicitly migrates it
  through the new tool.
- Runtime downloader behavior remains unchanged.
- Remote source adapter behavior remains unchanged except that future fixtures
  can be generated from this tooling.
- The tool should run through the repo's pinned `pnpm@11.5.0` environment.

## Validation Strategy

Focused tests should cover:

- check mode passes for an up-to-date local package;
- check mode fails for stale asset hash;
- check mode fails for stale package hash;
- update mode writes asset hashes and package hash;
- missing files fail clearly;
- unsafe paths fail clearly;
- generated package hash matches `calculateSkinPackageHash`.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-skin-package-publishing-tooling --strict
```
