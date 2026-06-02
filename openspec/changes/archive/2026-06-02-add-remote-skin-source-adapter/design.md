# Design: Add Remote Skin Source Adapter

## Overview

The existing downloader already accepts a `SkinPackageSourceAdapter` and owns the
safe package lifecycle:

1. create runtime staging storage;
2. ask the source adapter to stage package files;
3. validate manifest, asset hashes, package hash, and feature compatibility;
4. promote staging into ready storage;
5. preserve the previous ready skin on failure.

This change adds a production-shaped remote source adapter behind that same
boundary. The adapter fetches remote package data and writes files into the
staging directory provided by `downloadSkinPackage`. The downloader remains the
only module that can mark a package ready or active.

## Key Decisions

### Direct Manifest URL First

The first implementation should support a direct remote manifest URL plus an
optional asset base URL. A remote index can be represented as a descriptor type,
but index fetching itself is deferred unless implementation discovers it is
needed for tests.

This keeps the first remote path small:

- caller resolves a `RemoteSkinPackageDescriptor`;
- adapter fetches `descriptor.manifestUrl`;
- adapter parses the fetched manifest enough to discover declared assets;
- adapter downloads declared assets into staging;
- adapter returns `SkinPackageSourcePayload` to the existing downloader.

### Remote Data Is Still Untrusted

The remote adapter must not treat fetched data as trusted. It may read enough of
the raw manifest object to know which asset paths to download, but activation
still depends on the existing validation pipeline.

The adapter must not import page components, route modules, or execute remote
JavaScript. It only fetches data and files.

### Progress Is Adapter-Level

Progress should be exposed through an optional callback on the remote adapter
input. The callback should support stable phase values such as:

- `manifest`
- `asset`
- `complete`

The existing persisted package state remains coarse-grained:

- `checking`
- `downloading`
- `ready`
- `failed`
- `incompatible`

This avoids mixing UI progress details into persisted skin state before a UI
change exists.

### Cancellation Uses AbortSignal

Use an optional `AbortSignal`-compatible dependency for cancellation. This fits
standard fetch semantics and keeps cancellation testable.

Cancellation should fail as a source-level package failure and must not promote
partial files. If a more specific persisted failure reason is added, it should
remain recoverable and preserve `activeSkinId` / `lastReadySkinId`.

### Retry Policy Is Dependency-Injected

The remote adapter should support a small retry policy for manifest and asset
fetches:

- retry count;
- delay function or injected scheduler for tests;
- retry only on fetch/network failures or retryable HTTP responses.

The policy should default conservatively and remain deterministic in unit tests.

### FileSystem and Fetch Are Injected

To avoid real network and filesystem access in unit tests, the remote adapter
should accept injected dependencies for:

- `fetchJson` or `fetchText` / `fetchBytes`;
- file writing to staging;
- hashing package/asset contents if the implementation computes hashes while
  downloading;
- retry delay scheduling.

Expo FileSystem writes belong inside the remote adapter or a skin-local helper,
not route/page code.

## Proposed Modules

Likely implementation files:

- `src/skin/remoteSourceAdapter.ts`
- `tests/skin/remote-source-adapter.test.ts`

Potential type additions:

- `RemoteSkinPackageDescriptor`
- `RemoteSkinPackageProgress`
- `RemoteSkinPackageRetryPolicy`
- `RemoteSkinPackageAdapterDependencies`
- `SkinPackageFailureReason` additions only if needed for cancellation or
  timeout distinction

## Integration Flow

```text
Remote descriptor
  -> createRemoteSkinPackageSource(...)
  -> downloadSkinPackage(...)
  -> remote adapter stages manifest/assets
  -> existing package validation
  -> existing promotion or safe failure
```

The build phase should prefer adapting the current downloader rather than
replacing it.

## Validation Strategy

Focused tests should cover:

- manifest fetch success;
- asset fetch success;
- remote URL resolution from manifest asset paths;
- manifest fetch failure;
- asset fetch failure;
- retry attempts and retry exhaustion;
- cancellation before completion;
- progress callback order;
- integration with `downloadSkinPackage`;
- no active/last-ready overwrite on remote failure.

Core regression checks:

- `pnpm test tests/skin --runInBand`
- `pnpm test tests/support/source-structure.test.ts --runInBand`
- `pnpm check:type`

Use the repository's pinned pnpm version if `pnpm` is not directly available:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm <command>
```
