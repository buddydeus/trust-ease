# Tasks

## 1. Define remote adapter contracts

- [x] Add remote package descriptor, progress, retry, cancellation, and
      dependency interfaces under `src/skin/`.
- [x] Extend existing skin package failure reasons only if the implementation
      needs distinct cancellation or timeout reporting.
- [x] Keep remote descriptor identity aligned with `SkinPackageIdentity`.
- [x] Run `pnpm check:type`.

## 2. Add remote adapter unit coverage

- [x] Add `tests/skin/remote-source-adapter.test.ts` for manifest fetch success,
      asset staging success, URL resolution, progress events, fetch failure,
      retry exhaustion, and cancellation.
- [x] Mock network and file writes through injected dependencies.
- [x] Ensure tests do not make real network requests.
- [x] Run `pnpm test tests/skin/remote-source-adapter.test.ts --runInBand`.

## 3. Implement remote source adapter

- [x] Add `src/skin/remoteSourceAdapter.ts`.
- [x] Fetch remote manifest as untrusted data and use it only to discover
      declared asset paths.
- [x] Fetch and write declared assets into the downloader-provided staging
      directory.
- [x] Return `SkinPackageSourcePayload` so existing package validation gates
      activation.
- [x] Keep project-root `skins/` read-only build-time input.

## 4. Integrate remote adapter with existing downloader behavior

- [x] Add or extend tests proving `downloadSkinPackage` can consume the remote
      adapter and promote a valid remote package.
- [x] Add or extend tests proving manifest failure, asset failure, cancellation,
      validation failure, and incompatibility preserve previous active and
      last-ready skins.
- [x] Avoid adding route or page implementation details for remote network
      downloads.
- [x] Run `pnpm test tests/skin --runInBand`.

## 5. Update docs and structure checks

- [x] Update `README.md` and `AGENTS.md` only where they describe remote skin
      package behavior or implementation boundaries.
- [x] Do not add user-visible app copy unless the scope is explicitly expanded.
- [x] Confirm `.ai/` remains unchanged.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 6. Final verification

- [x] Run `npm.cmd exec -- openspec validate add-remote-skin-source-adapter --strict`.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `git diff -- .ai`.
