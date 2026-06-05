# Tasks

## 1. Add backup serialization and parsing helpers

- [ ] Add local trust backup types and constants under `src/store/trust`.
- [ ] Add export helper that validates an `ITrustDataSnapshot` and serializes a
      versioned backup envelope.
- [ ] Add import parser that validates backup product marker, backup schema
      version, trust schema version, and embedded snapshot structure.
- [ ] Add import preview derivation with item/helper/archive/trigger summaries.
- [ ] Export stable helper APIs from `src/store/trust/index.ts`.
- [ ] Cover export, import validation, preview counts, and invalid input cases
      with focused trust store tests.

## 2. Add local file IO adapter boundary

- [ ] Add a small backup file adapter abstraction for write/select/read behavior.
- [ ] Use existing Expo-compatible file APIs where available and keep native IO
      mockable in tests.
- [ ] Ensure adapter cancellation and read/write failures return explicit states
      instead of throwing into page UI.
- [ ] Cover adapter-facing controller behavior with tests or route mocks.

## 3. Add backup workflow UI

- [ ] Add a My/settings backup entry or focused backup page component.
- [ ] Render local-only explanation, export action, import action, validation
      errors, preview metadata, replacement warning, confirm action, and cancel
      action.
- [ ] Keep page components prop-driven and free of direct AsyncStorage or native
      file IO access.
- [ ] Avoid legal authority, cloud restore, account recovery, automatic delivery,
      third-party account control, and encryption promise wording.
- [ ] Cover rendering, export click, import preview, confirm, cancel, and unsafe
      wording boundaries with focused page tests.

## 4. Wire backup workflow to local storage

- [ ] Load current trust data through `loadTrustDataSnapshot` before export.
- [ ] Use backup export helper and file adapter to create a local backup file.
- [ ] Use backup import parser to preview a selected backup without writing.
- [ ] Save only confirmed imports through `saveTrustDataSnapshot`.
- [ ] Preserve current local data on parse failure, validation failure, adapter
      cancellation, preview cancellation, and failed confirmation.
- [ ] Refresh the visible local state after successful import.
- [ ] Cover route/controller integration with focused tests.

## 5. Update localization and copy boundaries

- [ ] Add backup workflow copy to `src/locals/zh-CN.json`.
- [ ] Add matching backup workflow copy to `src/locals/zh-TW.json`.
- [ ] Add matching backup workflow copy to `src/locals/en-US.json`.
- [ ] Run `pnpm check:local`.
- [ ] Cover required localized copy through i18n or page tests.

## 6. Final verification

- [ ] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand`.
- [ ] Run focused backup/My page tests.
- [ ] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`.
- [ ] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local`.
- [ ] Run `npm.cmd exec -- openspec validate add-local-backup-export-import --strict`.
- [ ] Run `npm.cmd exec -- openspec validate --all --strict`.
- [ ] Run `git diff -- .ai`.
