# add-skin-package-publishing-tooling Build Plan

## Source

- Proposal: `openspec/changes/add-skin-package-publishing-tooling/proposal.md`
- Design: `openspec/changes/add-skin-package-publishing-tooling/design.md`
- Specs: `openspec/changes/add-skin-package-publishing-tooling/specs/`
- Tasks: `openspec/changes/add-skin-package-publishing-tooling/tasks.md`

## Implementation

- [x] Add shared skin content hash helper in `src/skin/contentHash.ts`.
- [x] Reuse the shared content hash from package hash and remote source adapter code.
- [x] Add `src/skin/publishingTool.ts` as the local skin package publishing helper.
- [x] Support typed check/update inputs, results, and issue codes.
- [x] Read local `manifest.json` as data and parse it through the existing skin manifest parser.
- [x] Extract declared asset paths and validate them as safe relative package paths.
- [x] Detect missing assets, unsafe paths, and duplicate normalized paths.
- [x] Calculate declared asset content hashes from local files.
- [x] Reuse `calculateSkinPackageHash` for package-level canonical hashing.
- [x] Keep manifest `packageHash` self-neutralized through the canonical helper.
- [x] Implement check mode without mutation.
- [x] Implement update mode with deterministic `manifest.json` output.
- [x] Add `scripts/skin_package_tool.js` as a thin local command entry point.
- [x] Add `pnpm skin:package` script.
- [x] Document `skin:package` in `README.md` and `AGENTS.md`.

## Tests

- [x] Add `tests/skin/publishing-tool.test.ts`.
- [x] Cover up-to-date check mode.
- [x] Cover stale asset hash failure.
- [x] Cover stale package hash failure.
- [x] Cover update mode writing asset hashes and package hash.
- [x] Cover repeated update stability.
- [x] Cover missing asset failure.
- [x] Cover unsafe and duplicate normalized paths.
- [x] Cover generated package hash equivalence with `calculateSkinPackageHash`.

## Verification

- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/publishing-tool.test.ts --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:package -- --help`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:package -- update <temp-fixture>`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm skin:package -- check <temp-fixture>`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/package-hash.test.ts --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand`
- [x] `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`
