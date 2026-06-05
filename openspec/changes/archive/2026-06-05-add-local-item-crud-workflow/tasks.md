# Tasks

## 1. Add local item mutation helpers

- [x] Add pure item create, update, and archive helpers under `src/store/trust`.
- [x] Validate item title and item kind before mutation.
- [x] Generate or accept durable ids for new items in a testable way.
- [x] Preserve unrelated snapshot fields during create, update, and archive.
- [x] Cover helpers with focused trust store tests.

## 2. Update Items screen for local data

- [x] Replace hard-coded item card rendering with item view models passed from
      route or tests.
- [x] Add empty state UI and create action copy.
- [x] Render item title, kind, summary/meta, edit action, and archive action.
- [x] Preserve the circular add action behavior.
- [x] Cover empty, active-list, add, edit, and archive callback behavior in
      page tests.

## 3. Update Item form for create and edit

- [x] Add title, item kind, and summary inputs.
- [x] Add save action and validation feedback.
- [x] Support initial values for edit mode.
- [x] Emit validated submit payloads to the route layer.
- [x] Cover create/edit form rendering, validation, and submit behavior in page
      tests.

## 4. Wire routes to local trust storage

- [x] Make `src/app/(tabs)/items.tsx` load local trust data and pass active
      items to `ItemsScreen`.
- [x] Keep the add action navigating to `/items/new`.
- [x] Make `src/app/items/new.tsx` create and persist a local trust item.
- [x] Add edit route or route mode for editing existing items if needed.
- [x] Ensure create, edit, and archive persist through AsyncStorage and navigate
      predictably.

## 5. Update localization and regression coverage

- [x] Add new item CRUD copy to `zh-CN`, `zh-TW`, and `en-US`.
- [x] Remove obsolete sample-only copy only if it is no longer used and locale
      checks remain green.
- [x] Run `pnpm check:local`.
- [x] Run focused page and store tests.
- [x] Run `pnpm check:type`.
- [x] Run `npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
