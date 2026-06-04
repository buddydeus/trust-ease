# Add Skin Package Publishing Tooling

## Why

The app runtime can now calculate canonical skin package hashes and the remote
source adapter can stage data-only skin packages through the downloader
validation pipeline. However, there is no project tool that prepares a local
skin package with the same canonical integrity contract.

Without publishing tooling, future remote skin QA work would need hand-written
manifest hashes and package hashes. That makes fixtures fragile, easy to drift
from runtime rules, and difficult to reproduce across machines.

This change adds a local, deterministic skin package publishing and validation
tooling path for developers and future CI. It should make a skin package
directory self-checkable before the app attempts to download or activate it.

## What Changes

- Add a local skin package tooling entry point for project-managed skin package
  directories.
- Reuse the existing app-side canonical package hash contract rather than
  defining a second package hash algorithm.
- Validate manifest asset declarations against files in the package directory.
- Calculate or verify per-asset hashes for declared static assets.
- Calculate the canonical package hash from the manifest and declared files.
- Support a check mode that fails when manifest asset hashes or `packageHash`
  are stale.
- Support an update mode that writes the calculated hashes back to
  `manifest.json`.
- Produce deterministic output suitable for future remote skin QA fixtures.

## Success Criteria

- Developers can run one command against a local skin package directory and see
  whether its manifest asset hashes and package hash are valid.
- Developers can run one command to update a local skin package manifest with
  current asset hashes and canonical `packageHash`.
- Generated `packageHash` values match the runtime
  `calculateSkinPackageHash` behavior.
- Invalid asset paths, missing files, unsafe paths, and stale hashes fail with
  clear messages.
- The tool does not write into Expo runtime storage and does not treat the
  project-root `skins/` directory as mobile runtime storage.
- The tool does not introduce remote code execution, remote React components,
  JavaScript plugin loading, a skin marketplace, or a user-facing download UI.

## Scope

In scope:

- Local script or CLI-style project command for skin package hash publishing.
- Manifest and asset hash validation for static files declared by the skin
  manifest.
- Tests for deterministic package hash generation, update/check modes, missing
  files, stale hashes, and unsafe paths.
- Documentation of the developer command in the relevant project docs or
  handoff notes if needed.

Out of scope:

- Remote skin index service or skin marketplace.
- User-facing remote skin download UI.
- Cryptographic signing, certificate chains, or key management.
- Arbitrary archive formats unless needed as a minimal implementation detail.
- Any ability to execute remote JavaScript, React components, or plugins.

## Existing Constraints

- Package manager remains `pnpm@11.5.0`.
- Runtime skin downloads still write only under Expo FileSystem
  `documentDirectory/skins/`.
- Project-root `skins/` remains a build-time bundled skin source and local
  tooling input, not mobile runtime storage.
- The canonical hash helper in `src/skin/packageHash.ts` is the source of truth
  for package-level hashing.
- New implementation should follow existing TypeScript strict-mode and test
  conventions.
