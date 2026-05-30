# Tasks

## 1. Define init and downloader contracts

- [x] Add or extend skin runtime types for package identity, package operation
      results, init status, and recoverable failure reasons.
- [x] Keep public types aligned with existing `SkinPackageState`,
      `SkinCompatibility`, and `SkinRuntime` concepts.
- [x] Run `pnpm check:type`.

## 2. Add pure init state-machine coverage

- [x] Add `tests/skin/init-state-machine.test.ts` for cold start, persisted
      ready skin, missing active skin, failed selected skin, incompatible skin,
      and bundled fallback behavior.
- [x] Implement a pure or dependency-injected init resolver under `src/skin/`.
- [x] Ensure failed, partial, and incompatible packages do not overwrite
      `lastReadySkinId`.
- [x] Run `pnpm test tests/skin/init-state-machine.test.ts --runInBand`.

## 3. Add package validation coverage and helpers

- [x] Add `tests/skin/package-validation.test.ts` for manifest parsing, skin id
      mismatch, asset hash mismatch, package hash mismatch, and compatibility
      outcomes.
- [x] Implement package validation helpers that reuse `parseSkinManifest` and
      existing compatibility checks.
- [x] Keep validation independent from route and page code.
- [x] Run `pnpm test tests/skin/package-validation.test.ts --runInBand`.

## 4. Add downloader staging and promotion lifecycle

- [x] Add `tests/skin/downloader.test.ts` for source success, source failure,
      staging, validation failure, incompatible package, promotion success, and
      promotion failure.
- [x] Implement skin-local downloader helpers that write only under
      `documentDirectory/skins/`.
- [x] Prevent partial staged files from being treated as ready packages.
- [x] Persist package state transitions without losing the previous ready skin.
- [x] Run `pnpm test tests/skin/downloader.test.ts --runInBand`.

## 5. Wire initialization into store and route startup

- [x] Extend store state/actions only as needed to expose init status and package
      outcomes.
- [x] Replace direct skin hydration decisions in the route-layer startup hook
      with the init resolver/runtime helper.
- [x] Keep `src/app` limited to hook composition and store application.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 6. Preserve page behavior and expose minimal state

- [x] Keep existing My page skin picker behavior unchanged for bundled
      `skin-001`.
- [x] If any skin status text is added, update `zh-CN`, `zh-TW`, and `en-US`
      locale files together.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [x] Run `pnpm check:local` if user-visible text changes.

## 7. Update docs and final verification

- [x] Update root docs only where they describe downloaded skin runtime behavior
      or init fallback behavior.
- [x] Confirm `.ai/` is unchanged with `git diff -- .ai`.
- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `pnpm check:type`.
