# Design: Add Skin Package Hash Canonicalization

## Overview

Skin packages already pass through manifest parsing, per-asset hash checks,
package hash checks, compatibility checks, and ready promotion. The missing
piece is a canonical package-level hash rule that can be reproduced by the app,
tests, and future publishing tooling.

This change defines package hash canonicalization as a skin runtime concern. It
does not add a remote marketplace, signing, or UI flow.

## Key Decisions

### Keep Canonicalization Inside `src/skin`

Package hash calculation should live in a focused skin runtime helper rather
than in route, page, or remote UI code. The downloader and remote adapter may
call the helper, but page components should continue to receive only state.

Likely implementation shape:

- `src/skin/packageHash.ts`
- `tests/skin/package-hash.test.ts`
- targeted updates to `src/skin/remoteSourceAdapter.ts`
- targeted updates to package validation or downloader tests only where needed

### Canonical Package Representation

The canonical input should be explicit and stable. It should include:

- a canonical format/version marker;
- package identity (`skinId`, `skinVersion`);
- normalized manifest representation;
- a sorted list of package files with normalized relative paths and content
  hashes.

The first implementation can calculate over the data already available from
staging/source payloads. It does not need to introduce an archive container
format.

### Path Normalization

All package file paths should normalize to slash-separated relative paths:

- `\` becomes `/`;
- leading slashes are removed;
- empty paths, `..` traversal, absolute paths, and URL-like paths are rejected;
- sorting uses normalized paths, not platform-native paths.

This keeps Windows and POSIX hash inputs equivalent.

### Deterministic Ordering

Package hash inputs should not depend on JavaScript object insertion order.
Canonicalization should sort:

- manifest object keys recursively when serializing manifest data;
- package file entries by normalized path;
- any map-like input by key.

Tests should prove that logically equivalent inputs with different property
orders produce the same hash.

### Asset Hash and Package Hash Boundaries

Per-asset hash checks remain the way to verify that each manifest-declared
asset matches the staged file. Package hash verifies the canonical package
representation as a whole.

The package-level canonical representation should avoid self-referential
instability. If the manifest contains its own `packageHash`, the canonical
manifest representation used for package hash should either omit that field or
otherwise define an unambiguous placeholder strategy. The first implementation
should prefer omitting `packageHash` from the canonical manifest input.

### Hash Algorithm Prefix

Existing tests use simple hash strings and the remote adapter currently uses
`fnv1a:*` content hashes. The canonical package helper should return a
self-describing string such as `fnv1a:<hex>` for consistency with current local
test infrastructure. This is not a cryptographic signing feature.

If a stronger digest is introduced later, it should be a separate change with
platform support and migration rules.

## Compatibility

- Existing manifest `packageHash` comparison remains the activation gate.
- Existing failure reason `package-hash-mismatch` remains valid.
- Existing remote descriptors may still provide an explicit `packageHash`.
- When descriptor-level package hash is absent, the remote adapter should use
  the canonical package hash helper rather than an ad hoc JSON fallback.

## Validation Strategy

Focused tests should cover:

- Windows and POSIX path separators produce the same package hash.
- File order does not affect package hash.
- Manifest property order does not affect package hash.
- Invalid relative paths are rejected.
- Remote adapter default package hash uses the canonical helper.
- Package hash mismatch still prevents activation.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-source-adapter.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-validation.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
```
