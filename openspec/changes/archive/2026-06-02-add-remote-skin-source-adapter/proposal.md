# Add Remote Skin Source Adapter

## Why

The current skin downloader has a controlled source-adapter boundary and a safe
staging/validation/promotion lifecycle, but the first implementation is still
centered on staged or local package sources. The next skin milestone needs a
real remote source adapter so the app can fetch skin packages from a network
location while preserving the existing safety guarantees.

This matters because downloaded skins must remain controlled data, not remote
code. The app should be able to discover or request a remote skin package,
download its required files into runtime staging storage, report progress and
recoverable failures, validate the complete package, and only then allow the
existing downloader to promote it to ready state.

## What Changes

- Add a remote URL skin package source adapter that implements the existing
  downloader source boundary.
- Support fetching a remote package manifest and declared asset files without
  allowing arbitrary remote React component or JavaScript execution.
- Preserve the existing staging, validation, feature compatibility, package
  state, and ready promotion rules.
- Add progress reporting hooks or callback data for checking and downloading
  states.
- Define network failure, retry, timeout, and cancellation behavior at the
  adapter boundary.
- Define how a remote skin index or direct skin manifest URL is represented for
  the first production-shaped implementation.
- Keep route and page code free of network downloader implementation details.

## Goals

- Let the skin runtime download a remote package into Expo FileSystem runtime
  staging storage.
- Ensure all remote files are validated by the existing manifest, asset hash,
  package hash, and featureVersion compatibility pipeline.
- Report enough operation progress for future UI to show checking, downloading,
  failed, incompatible, and retryable states.
- Keep `skins/` as build-time bundled source only; remote downloads must use
  `documentDirectory/skins/`.
- Make network errors deterministic in tests through dependency injection.
- Preserve the current default fallback to bundled `skin-001` when remote
  download, validation, promotion, or compatibility fails.

## Non-Goals

- Do not build the skin picker/status UI in this change.
- Do not add payments, accounts, authenticated skin marketplaces, or user-owned
  skin publishing.
- Do not execute remote React components, remote JavaScript, or plugin code.
- Do not replace the existing skin manifest parser or controlled component
  rendering model.
- Do not physically split the repository into a monorepo.
- Do not modify `.ai/` files.

## Expected Scope

### Remote Source Adapter

Introduce a skin-local remote adapter under `src/skin/` that can:

- accept a direct manifest URL or a resolved remote package descriptor;
- fetch `manifest.json`;
- fetch declared assets into the provided staging directory;
- return the existing `SkinPackageSourcePayload` shape to
  `downloadSkinPackage`;
- expose network and parsing failures as source-level operation failures.

### Remote Index or Descriptor

Define the first remote package descriptor shape needed to request a skin
download. The descriptor should be minimal and stable enough for tests and a
future UI, for example:

- skin id;
- skin version;
- manifest URL;
- optional base asset URL;
- optional package hash or signature metadata;
- optional display metadata for future UI.

### Progress, Retry, and Cancellation

Define adapter behavior for:

- download progress events;
- timeout or unreachable source;
- retryable and non-retryable failures;
- cancellation before validation or promotion;
- cleanup of partial staged files through the existing downloader lifecycle.

### Security and Integrity

Reuse existing validation gates and document any remaining integrity gaps. The
first implementation may keep package-level integrity aligned with the current
package hash helper, but it should not weaken asset hash or compatibility
checks.

### Tests and Docs

Add focused tests under `tests/skin/*` for remote adapter success, manifest
fetch failure, asset fetch failure, retry/cancel behavior, progress reporting,
and integration with `downloadSkinPackage`. Update root docs only where they
describe skin remote download behavior. Keep `.ai/` unchanged.

## Success Criteria

- A remote package can be fetched into staging, validated, promoted, and marked
  ready through the existing downloader lifecycle.
- Missing manifest, missing asset, bad network response, timeout, cancellation,
  validation failure, and incompatibility do not change the previous active or
  last-ready skin.
- Progress data is exposed without page components importing downloader
  internals.
- The implementation adds no remote arbitrary component or code execution.
- Existing skin runtime tests and source-structure tests continue to pass.
- `.ai/` remains unchanged.

## Constraints

- Use Expo FileSystem runtime storage under `documentDirectory/skins/`.
- Keep the route layer thin and delegate downloader orchestration to `src/skin`
  or store-backed helpers.
- Preserve `zh-CN`, `zh-TW`, and `en-US`; add no user-visible copy unless UI
  scope is explicitly expanded later.
- Preserve Expo 55, React 19, React Native 0.85, TypeScript strict mode, and
  current Jest testing setup.
- Use the repository dependency lock policy from
  `dependency-reproducibility`.

## Open Questions

- Should the first adapter use a direct manifest URL only, or include a remote
  index endpoint in the same change?
- Should retry/backoff be implemented inside the adapter, or exposed as a
  caller-owned policy for UI/store orchestration?
- What is the first cancellation contract: AbortController-style cancellation,
  adapter-specific token, or a simple injected cancellation callback?
- Should package-level integrity remain manifest-declared package hash for now,
  or should this change also introduce a deterministic archive/package hash
  algorithm?
