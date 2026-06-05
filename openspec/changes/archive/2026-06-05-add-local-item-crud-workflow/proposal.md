# Add Local Item CRUD Workflow

## Why

Trust Ease now has a versioned local trust data model and AsyncStorage-backed
persistence foundation. The next standalone MVP gap is that the Items tab and
New Item route still behave like a visual prototype: the list renders static
sample items, and the form route renders a non-persistent first-step shell.

For a single-device MVP, users need to create and manage real local important
items before helper assignment, trigger simulation, readiness summary, or backup
export can be meaningful. Without local item CRUD, the app cannot prove the
core “important matters handoff plan” loop beyond screenshots.

This change connects the existing Items and New Item surfaces to the local trust
snapshot so users can create, edit, archive, and review items entirely on one
device without backend accounts, sync, push notifications, or remote execution.

## What Changes

- Replace static item cards on the Items screen with local trust items loaded
  from the trust data snapshot.
- Add an empty state for users who have not created active items yet.
- Add local create behavior from the New Item route into the trust snapshot.
- Add local edit behavior for existing items.
- Add local archive behavior that marks items as archived without hard-deleting
  them.
- Preserve archived records in storage while excluding them from the default
  active item list.
- Add validation for required title and supported item kind.
- Keep current local-first architecture: route files bind i18n, navigation, and
  store helpers; page components render form/list UI.
- Add focused tests for empty state, create, edit, archive, validation, and
  route/page boundaries.
- Update `zh-CN`, `zh-TW`, and `en-US` copy for new visible states and actions.

## Success Criteria

- The Items tab renders real active trust items from local storage instead of
  hard-coded sample items.
- When no active items exist, the Items tab shows a calm empty state with a clear
  create action.
- Creating an item from the New Item route persists a valid `ITrustItem` in the
  local trust snapshot and returns to the Items tab.
- Editing an existing item updates title, kind, summary, and `updatedAt` without
  changing unrelated snapshot data.
- Archiving an item changes its status to `archived`, keeps it in the stored
  snapshot, and removes it from the active list.
- Form validation blocks empty titles and unsupported item kinds before saving.
- User-visible copy added by this change is present in `zh-CN`, `zh-TW`, and
  `en-US`.
- The implementation stays local-only and does not introduce backend, sync,
  helper/contact management UI, trigger simulation, backup import/export, or
  remote execution behavior.

## Scope

In scope:

- Local item list rendering from `ITrustDataSnapshot.items`.
- Local item create/edit/archive helpers and page wiring.
- New Item form fields needed for MVP item creation:
  - title;
  - kind: offline or online;
  - summary.
- Empty state, validation state, and archive action copy.
- Tests for page behavior, route integration, and trust snapshot updates.
- Minimal trust store helper additions if needed to avoid duplicating snapshot
  mutation logic in route files.

Out of scope:

- Trusted helper/contact management UI.
- Real helper assignment selection UI beyond preserving the existing `helperIds`
  field.
- Item detail deep navigation beyond what is necessary for local edit behavior.
- Trigger policy simulation or report/check-in changes.
- Backup export/import.
- Encryption or secure enclave storage.
- Backend APIs, account identity, sync, push notification, or multi-device
  behavior.
- Remote JavaScript, React component, plugin, or third-party account execution.
- Monorepo physical splitting.

## Existing Constraints

- Reuse the `src/store/trust` data contract from the archived
  `local-trust-data-model` spec.
- Keep `src/app/*` route modules thin: navigation, i18n assembly, and store
  binding only.
- Keep page UI and form rendering under `src/pages/items/*`.
- Use existing project dependencies such as React Hook Form and Zod if form
  validation benefits from them; do not add a new form or state framework.
- Do not change `.ai/`.
- New user-visible copy must be synchronized across `src/locals/zh-CN.json`,
  `src/locals/zh-TW.json`, and `src/locals/en-US.json`.
- The project-root `skins/` directory remains unrelated to mobile runtime
  storage.
