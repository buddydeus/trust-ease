# Design: Add Local Item CRUD Workflow

## Overview

This change turns the current Items and New Item prototype surfaces into a
local-first item management workflow. It builds directly on the archived
`local-trust-data-model` spec and the `src/store/trust` module added in the
previous phase.

The implementation should keep routes thin:

- route modules assemble i18n copy, bind local trust storage/helpers, and perform
  navigation;
- page components render list/form UI and expose callbacks;
- local snapshot mutation helpers live in `src/store/trust/` to avoid duplicating
  item update logic across routes.

No backend, sync, helper/contact management UI, trigger simulation, or backup
flow is introduced by this change.

## Route and Page Shape

### Items route

`src/app/(tabs)/items.tsx` should:

- load the local trust snapshot on mount;
- derive active items using the existing active item helper;
- pass render-ready item view models to `ItemsScreen`;
- keep the circular add action navigating to `/items/new`;
- expose edit/archive callbacks without embedding large UI logic in the route.

The route can use local React state for the loaded snapshot in this phase. A
larger shared Zustand store is not required unless build implementation finds a
clear need. AsyncStorage remains the source of persisted state.

### New/edit item route

The existing `/items/new` route should create a new item. Edit behavior can use
either:

- a new route such as `/items/[id]` or `/items/edit/[id]`; or
- a route parameter/mode on the current item form route.

The implementation should choose the smallest shape that stays compatible with
Expo Router and keeps tests readable. The form page should not know AsyncStorage
details; it should receive initial values, validation copy, and submit callbacks.

### Page components

`ItemsScreen` should render:

- title and add action;
- active/all filter controls if retained;
- empty state when no active items exist;
- one card per active item with title, kind, summary/meta, and edit/archive
  affordances.

`ItemFormScreen` should render a compact MVP form:

- title input;
- item kind selection for `offline` and `online`;
- summary input;
- validation feedback;
- save action.

The UI should stay calm and operational. Do not add high-pressure legal or
irreversible execution language.

## Local Mutation Helpers

Add narrowly scoped helpers under `src/store/trust/`, such as:

- `createTrustItem(snapshot, input, now)` returning a new snapshot and created
  item;
- `updateTrustItem(snapshot, itemId, input, now)` returning a new snapshot;
- `archiveTrustItem(snapshot, itemId, now)` returning a new snapshot.

The exact names can differ, but the behavior should be pure and testable:

- do not mutate the input snapshot;
- preserve unrelated `helpers` and `triggerPolicy`;
- preserve archived records;
- set `createdAt` and `updatedAt` deterministically from an injected clock or
  caller-provided timestamp;
- leave `helperIds` empty unless future helper assignment exists.

Use Zod or simple local validation for create/edit input. Since Zod is already a
project dependency, it is acceptable if it keeps route/page validation clear.

## ID and Timestamp Strategy

The previous data-model phase intentionally did not generate ids. This change
must create ids for new items.

For testability, item creation should accept an injected id/timestamp or route
helpers should wrap the generator. A simple local id such as
`item-${Date.now()}` is acceptable only if tests can avoid relying on real time.

`createdAt` and `updatedAt` should be ISO strings. Edits and archive operations
update `updatedAt`; edits should not change `createdAt`.

## i18n and Copy

All new user-visible copy must be added to:

- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`

Expected new copy areas:

- empty state title/body/action;
- form title label;
- summary label;
- save action;
- edit action;
- archive action;
- validation error for required title;
- validation error for invalid item kind if surfaced.

Existing sample item copy may be removed only after no code uses those keys and
`pnpm check:local` stays green.

## Compatibility

- `src/store/trust` remains the local durable contract.
- Archived items remain stored and are excluded from the active list.
- Existing onboarding, reporting, skin runtime, and thumbs behavior should not
  change.
- The Items tab still uses the circular add action.
- New copy must preserve the product tone: calm, clear, reversible, and not
  legal-advice-like.

## Validation Strategy

Focused tests should cover:

- empty state rendering when active items are empty;
- active local item rendering from a provided or loaded snapshot;
- add button still navigates to the creation route;
- create form validation blocks empty title;
- valid create persists an item and navigates back to the Items tab;
- edit updates item fields without changing unrelated snapshot data;
- archive marks the item archived, preserves it in storage, and removes it from
  active list;
- locale check passes after copy changes.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-item-crud-workflow --strict
```
