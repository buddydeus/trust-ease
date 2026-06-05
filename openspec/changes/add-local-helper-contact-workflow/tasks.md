# Tasks

## 1. Add local helper mutation helpers

- [x] Add pure helper create, update, and archive helpers under
      `src/store/trust`.
- [x] Validate helper display name and contact method before mutation.
- [x] Generate or accept durable ids for new helpers in a testable way.
- [x] Preserve unrelated snapshot fields during create, update, and archive.
- [x] Cover helpers with focused trust store tests.

## 2. Add item helper assignment support

- [x] Add a pure item helper assignment helper under `src/store/trust`.
- [x] Reject missing item ids, unknown helper ids, and archived helper ids.
- [x] Deduplicate helper ids while preserving deterministic selection order.
- [x] Preserve unrelated item fields and snapshot fields during assignment.
- [x] Cover assignment behavior with focused trust store tests.

## 3. Add helper list and form UI

- [x] Add helper list and helper form page components under `src/pages`.
- [x] Render active helpers, empty state, local-only explanation, edit action,
      and archive action.
- [x] Render helper form fields for display name, relationship, contact method,
      and notes.
- [x] Add save action and validation feedback.
- [x] Cover helper list/form rendering, validation, and callbacks in page tests.

## 4. Wire helper routes to local trust storage

- [x] Add helper list/create/edit routes following current Expo Router
      conventions.
- [x] Load active helpers from local trust storage and pass view models to page
      components.
- [x] Persist helper create, edit, and archive actions through AsyncStorage.
- [x] Add a navigation entry to reach helper management from an existing product
      surface.
- [x] Cover route persistence and navigation behavior in tests.

## 5. Wire helper assignment into item workflow

- [x] Extend item form or item edit UI to display active helper choices.
- [x] Persist selected helper ids into the edited item's `helperIds`.
- [x] Keep archived helpers out of default assignment choices.
- [x] Preserve existing item create/edit/archive behavior.
- [x] Cover item assignment behavior in item page tests.

## 6. Update localization and regression coverage

- [x] Add new helper/contact and assignment copy to `zh-CN`, `zh-TW`, and
      `en-US`.
- [x] Run `pnpm check:local`.
- [x] Run focused helper, item, and trust store tests.
- [x] Run `pnpm check:type`.
- [x] Run `npm.cmd exec -- openspec validate add-local-helper-contact-workflow --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
