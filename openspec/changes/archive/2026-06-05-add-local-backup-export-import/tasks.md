# Tasks

## 1. Add backup serialization and parsing helpers

- [x] Add local trust backup types and constants under `src/store/trust`.
- [x] Add export helper that validates an `ITrustDataSnapshot` and serializes a
      versioned backup envelope.
- [x] Add import parser that validates backup product marker, backup schema
      version, trust schema version, and embedded snapshot structure.
- [x] Add import preview derivation with item/helper/archive/trigger summaries.
- [x] Export stable helper APIs from `src/store/trust/index.ts`.
- [x] Cover export, import validation, preview counts, and invalid input cases
      with focused trust store tests.

## 2. Add local file IO adapter boundary

- [x] Add a small backup file adapter abstraction for write/select/read behavior.
- [x] Use existing Expo-compatible file APIs where available and keep native IO
      mockable in tests.
- [x] Ensure adapter cancellation and read/write failures return explicit states
      instead of throwing into page UI.
- [x] Cover adapter-facing controller behavior with tests or route mocks.

## 3. Add backup workflow UI

- [x] Add a My/settings backup entry or focused backup page component.
- [x] Render local-only explanation, export action, import action, validation
      errors, preview metadata, replacement warning, confirm action, and cancel
      action.
- [x] Keep page components prop-driven and free of direct AsyncStorage or native
      file IO access.
- [x] Avoid legal authority, cloud restore, account recovery, automatic delivery,
      third-party account control, and encryption promise wording.
- [x] Cover rendering, export click, import preview, confirm, cancel, and unsafe
      wording boundaries with focused page tests.

## 4. Wire backup workflow to local storage

- [x] Load current trust data through `loadTrustDataSnapshot` before export.
- [x] Use backup export helper and file adapter to create a local backup file.
- [x] Use backup import parser to preview a selected backup without writing.
- [x] Save only confirmed imports through `saveTrustDataSnapshot`.
- [x] Preserve current local data on parse failure, validation failure, adapter
      cancellation, preview cancellation, and failed confirmation.
- [x] Refresh the visible local state after successful import.
- [x] Cover route/controller integration with focused tests.

## 5. Update localization and copy boundaries

- [x] Add backup workflow copy to `src/locals/zh-CN.json`.
- [x] Add matching backup workflow copy to `src/locals/zh-TW.json`.
- [x] Add matching backup workflow copy to `src/locals/en-US.json`.
- [x] Run `pnpm check:local`.
- [x] Cover required localized copy through i18n or page tests.

## 6. Final verification

- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`.
- [x] Run focused backup/My page tests.
- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`.
- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`.
- [x] Run `npm.cmd exec -- openspec validate add-local-backup-export-import --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
