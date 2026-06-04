# Tasks

## 1. Add publishing helper contract

- [x] Add a focused skin package publishing helper with typed check/update
      inputs and results.
- [x] Read and parse local `manifest.json` as data.
- [x] Extract declared static asset paths from the manifest.
- [x] Validate asset paths as safe relative package paths.
- [x] Detect duplicate normalized asset paths.

## 2. Implement asset and package hash calculation

- [x] Calculate declared asset content hashes from local files.
- [x] Fail clearly when a declared asset file is missing.
- [x] Reuse `calculateSkinPackageHash` for package-level hashing.
- [x] Ensure manifest `packageHash` remains self-neutralized.
- [x] Ensure generated hashes are deterministic across repeated runs.

## 3. Implement check and update modes

- [x] Implement check mode that reports stale asset hashes without writing.
- [x] Implement check mode that reports stale package hash without writing.
- [x] Implement update mode that writes asset hashes to `manifest.json`.
- [x] Implement update mode that writes top-level `packageHash`.
- [x] Preserve deterministic manifest output across repeated update runs.

## 4. Add project command or script entry point

- [x] Add a thin local script or CLI-style project command for the publishing
      helper.
- [x] Document command arguments for check and update modes.
- [x] Ensure the command works through the pinned pnpm project environment.
- [x] Keep the script local-only and free of remote fetch behavior.

## 5. Add tests and verification

- [x] Add focused tests for up-to-date check mode.
- [x] Add tests for stale asset hash failure.
- [x] Add tests for stale package hash failure.
- [x] Add tests for update mode writing hashes.
- [x] Add tests for missing files and unsafe paths.
- [x] Run `pnpm test tests/skin/publishing-tool.test.ts --runInBand`.
- [x] Run `pnpm test tests/skin/package-hash.test.ts --runInBand`.
- [x] Run `pnpm test tests/skin --runInBand`.
- [x] Run `pnpm check:type`.
- [x] Run `npm.cmd exec -- openspec validate add-skin-package-publishing-tooling --strict`.
- [x] Run `git diff -- .ai`.
