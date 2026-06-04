# Change: Add Skin Package Hash Canonicalization

## Why

Remote skin packages are now downloaded through a controlled adapter and gated
by manifest, asset hash, package hash, and feature compatibility validation.
However, package-level hash calculation is not yet defined as a stable
cross-platform contract. The current remote adapter can fall back to hashing a
JSON object shaped by runtime insertion order, which is useful for tests but
not strong enough as the canonical integrity rule for real remote packages.

Without a canonical package hash rule, the same package may hash differently
across platforms or implementations, and future remote skin publishing tools
would not have a precise target to reproduce.

## What Changes

- Define a canonical package hash input format for skin packages.
- Specify deterministic file ordering for all package files included in the
  package-level hash.
- Normalize package file paths so Windows and POSIX path separators produce the
  same package hash.
- Clarify the relationship between manifest hash, individual asset hashes, and
  package-level hash.
- Require tests that prove the same logical package hashes identically across
  path separator differences and object/property ordering differences.
- Keep package hash validation inside `src/skin` runtime modules and out of
  route/page code.

## Scope

In scope:

- Hash canonicalization rules for downloaded or staged skin packages.
- A runtime helper for calculating canonical package hashes.
- Tests for deterministic ordering, path normalization, and mismatch rejection.
- Updating remote source adapter defaults to use the canonical package hash
  helper when descriptor-level package hash is not explicitly supplied.

Out of scope:

- Remote skin marketplace or skin index UI.
- Remote JavaScript, remote React components, or plugin execution.
- Monorepo physical package extraction.
- Cryptographic signing, certificate chains, or publisher identity trust.
- Changing user-facing skin status UI beyond behavior required to surface
  existing failed package hash validation.

## Success Criteria

- A package hash can be reproduced from the same logical package regardless of
  Windows or POSIX path separators.
- Package hash input ordering is explicitly documented and covered by tests.
- Asset hash checking remains per manifest asset entry, while package hash
  covers the canonical package representation.
- A mismatched package hash still prevents activation and leaves the previous
  ready skin usable.
- Existing downloader, remote adapter, init state machine, My page status UI,
  and OpenSpec validations continue to pass.

## Assumptions

- The first canonical package hash can be implemented over the files and data
  already available in staging/adapter payloads; no archive container format is
  required yet.
- The canonical format should be versioned or self-describing enough that a
  future signed package format can build on it without changing current
  validation semantics.
- Remote packages continue to be data-only: manifest plus declared static
  assets.
