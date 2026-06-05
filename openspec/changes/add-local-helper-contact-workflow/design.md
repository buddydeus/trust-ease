# Design: Add Local Helper Contact Workflow

## Overview

This change adds the next local-first MVP layer on top of the archived
`local-trust-data-model` and `local-item-crud-workflow` specs. The app already
stores `ITrustedHelper[]` and `ITrustItem.helperIds`; this change makes those
fields user-manageable through local UI and pure mutation helpers.

The implementation should preserve the existing shape:

- route modules assemble i18n copy, bind local trust storage/helpers, and handle
  navigation;
- page components render helper/contact and assignment UI through props and
  callbacks;
- local snapshot mutation helpers live under `src/store/trust/`;
- AsyncStorage remains the only durable persistence layer.

No backend, sync, contacts permission, messaging, trigger simulation, backup
flow, or legal execution behavior is introduced by this change.

## Route and Page Shape

### Helper list route

Add a helper/contact management entry that fits the existing Expo Router
structure. The preferred minimal shape is:

- `src/app/helpers/index.tsx` for active helper list and empty state;
- `src/app/helpers/new.tsx` for creating a helper;
- `src/app/helpers/[id].tsx` for editing an existing helper.

The route entry can be reached from an existing product surface such as My, or
from item assignment UI if implementation finds that more natural. The route
should remain thin: load the local trust snapshot, map active helpers to view
models, pass callbacks to page components, and save validated mutation results.

### Helper page components

Create page-level components under `src/pages/helpers/` for:

- helper list;
- helper form;
- helper expectation/local-only explanatory text.

The list should render active helpers only by default, plus a calm empty state.
The form should include:

- display name;
- relationship;
- contact method;
- notes or expectation summary;
- save action;
- validation feedback for required display name and contact method.

The page copy should clearly state that the app records helper information
locally and does not automatically send messages or create legal authority.

### Item assignment UI

Extend item editing or item form UI to accept active helper choices and emit
`helperIds` with item updates. The existing `ItemFormScreen` already supports
initial values and validated submit callbacks; this change can either:

- extend the existing item form props with helper choices and selected ids; or
- add a small assignment section component beside the item form.

Assignment should update only `ITrustItem.helperIds` and `updatedAt`. It should
not change item title, kind, summary, status, `createdAt`, unrelated items,
helpers, or trigger policy.

Archived helpers should not be offered as active assignment choices. If an item
already references an archived helper, the implementation should avoid crashing
and may show a muted archived/unavailable label if surfaced.

## Local Mutation Helpers

Add narrowly scoped pure helpers under `src/store/trust/`, likely
`helpers.ts`, for:

- create helper;
- update helper;
- archive helper;
- assign helpers to an item.

The exact names can differ, but behavior should be pure and testable:

- do not mutate the input snapshot;
- trim string input;
- validate required fields before mutation;
- preserve unrelated `items`, `helpers`, and `triggerPolicy`;
- preserve archived records;
- set `createdAt` and `updatedAt` from caller-provided timestamps;
- keep item assignment deterministic by deduplicating helper ids while
  preserving order.

Helper create should accept an injected id and timestamp so tests do not depend
on real time. Route modules can wrap this with `Date.now()` and
`new Date().toISOString()`.

## Validation and Missing References

Minimum validation:

- helper display name is required;
- contact method is required;
- missing helper id for update/archive fails safely;
- assignment rejects helper ids that do not exist or are archived;
- assignment rejects missing item id;
- failure returns the original snapshot.

The UI may surface only the user-facing validation cases. Store helper tests
should cover all failure reasons.

## i18n and Copy

All new user-visible copy must exist in:

- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`

Expected copy areas:

- helper list title;
- empty state title/body/action;
- form field labels and placeholders;
- save/edit/archive actions;
- assignment section label and helper choice labels;
- local-only explanatory copy;
- validation messages for required display name and contact method.

The copy should be gentle and precise. Prefer "托付", "协助人", "联系方法",
"说明", and "本地记录". Avoid implying automatic notification, legal
authority, or direct third-party account control.

## Compatibility

- `src/store/trust` remains the local durable contract.
- Existing item create/edit/archive behavior should continue to pass.
- Existing onboarding, reporting, skin runtime, and thumbs behavior should not
  change.
- No network dependency, backend account, push notification, contacts
  permission, or remote execution is added.
- Project-root `skins/` remains unrelated to mobile runtime storage.

## Validation Strategy

Focused tests should cover:

- create helper with valid input;
- reject missing display name or contact method;
- edit helper without rewriting unrelated snapshot data;
- archive helper without hard-deleting it;
- active helper list excludes archived helpers;
- assign active helpers to an item;
- reject missing, archived, or unknown helper ids during assignment;
- item assignment preserves unrelated item and snapshot fields;
- helper list/form route persistence behavior;
- item form assignment behavior;
- locale check passes after copy changes.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/helpers --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/items --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-helper-contact-workflow --strict
```
