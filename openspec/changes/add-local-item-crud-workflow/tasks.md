# Tasks

## 1. Add local item mutation helpers

- [ ] Add pure item create, update, and archive helpers under `src/store/trust`.
- [ ] Validate item title and item kind before mutation.
- [ ] Generate or accept durable ids for new items in a testable way.
- [ ] Preserve unrelated snapshot fields during create, update, and archive.
- [ ] Cover helpers with focused trust store tests.

## 2. Update Items screen for local data

- [ ] Replace hard-coded item card rendering with item view models passed from
      route or tests.
- [ ] Add empty state UI and create action copy.
- [ ] Render item title, kind, summary/meta, edit action, and archive action.
- [ ] Preserve the circular add action behavior.
- [ ] Cover empty, active-list, add, edit, and archive callback behavior in
      page tests.

## 3. Update Item form for create and edit

- [ ] Add title, item kind, and summary inputs.
- [ ] Add save action and validation feedback.
- [ ] Support initial values for edit mode.
- [ ] Emit validated submit payloads to the route layer.
- [ ] Cover create/edit form rendering, validation, and submit behavior in page
      tests.

## 4. Wire routes to local trust storage

- [ ] Make `src/app/(tabs)/items.tsx` load local trust data and pass active
      items to `ItemsScreen`.
- [ ] Keep the add action navigating to `/items/new`.
- [ ] Make `src/app/items/new.tsx` create and persist a local trust item.
- [ ] Add edit route or route mode for editing existing items if needed.
- [ ] Ensure create, edit, and archive persist through AsyncStorage and navigate
      predictably.

## 5. Update localization and regression coverage

- [ ] Add new item CRUD copy to `zh-CN`, `zh-TW`, and `en-US`.
- [ ] Remove obsolete sample-only copy only if it is no longer used and locale
      checks remain green.
- [ ] Run `pnpm check:local`.
- [ ] Run focused page and store tests.
- [ ] Run `pnpm check:type`.
- [ ] Run `npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict`.
- [ ] Run `npm.cmd exec -- openspec validate --all --strict`.
- [ ] Run `git diff -- .ai`.
