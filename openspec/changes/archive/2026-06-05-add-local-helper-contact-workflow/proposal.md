# Add Local Helper Contact Workflow

## Why

Trust Ease now has a versioned local trust snapshot and a working local item
CRUD workflow. The next standalone MVP gap is that important items can store
`helperIds`, but the app does not yet let the user create or manage the trusted
helpers/contacts those ids refer to.

For a single-device MVP, the plan is not useful until the user can record who
may help, what relationship they have to the user, how they can be contacted,
and which local items they are expected to help with. This must remain calm and
local-first: the app records the plan, but it does not automatically message
people, perform legal handoff, replace notarization, or execute third-party
account actions.

This change adds a local helper/contact workflow that builds on the existing
`src/store/trust` data contract and item CRUD surfaces, without adding backend
accounts, sync, push notifications, contact-book permissions, or network
delivery.

## What Changes

- Add local helper/contact create, edit, archive, and list behavior backed by
  the existing local trust snapshot.
- Capture MVP helper fields:
  - display name;
  - relationship;
  - contact method;
  - notes or expectation summary.
- Add item-to-helper assignment behavior so local items can reference selected
  helper ids through `helperIds`.
- Show helper expectations in user-friendly language so the user understands
  this is a recorded local plan, not an automatic notification or legal action.
- Preserve archived helpers in local storage while excluding them from default
  active helper choices.
- Keep route files focused on i18n, navigation, and trust storage binding.
- Keep helper/contact UI under page-level components and local mutation logic
  under `src/store/trust`.
- Add focused tests for helper create/edit/archive, active helper list behavior,
  item assignment, persistence, and copy boundaries.
- Update `zh-CN`, `zh-TW`, and `en-US` copy for all new visible labels,
  empty states, validation messages, and explanatory text.

## Success Criteria

- A user can create a trusted helper/contact locally with name, relationship,
  contact method, and notes.
- A user can edit an existing helper/contact without rewriting unrelated local
  trust data.
- A user can archive a helper/contact without hard-deleting it.
- Archived helpers remain stored but are excluded from default active helper
  lists and assignment choices.
- A user can assign one or more active helpers to a local trust item by updating
  the item's `helperIds`.
- Item assignment preserves item title, kind, summary, status, and unrelated
  snapshot data.
- Helper/contact screens clearly communicate that the app records the plan
  locally and does not automatically send messages or perform legal execution.
- New user-visible copy exists in `zh-CN`, `zh-TW`, and `en-US`.
- The change remains local-only and introduces no backend account, sync, push
  notification, address-book permission, or network delivery behavior.

## Scope

In scope:

- Local helper/contact list, empty state, create, edit, and archive behavior.
- Helper/contact mutation helpers under `src/store/trust` if needed.
- Item assignment UI or route flow sufficient to attach helper ids to local
  items.
- Tests for local persistence, safe missing-id behavior, archived filtering,
  item assignment, and page/route boundaries.
- Calm explanatory copy about helper expectations and local-only storage.

Out of scope:

- Reading the device address book or requesting contacts permission.
- Sending SMS, email, push notifications, or any other real message.
- Backend accounts, cloud sync, identity verification, or multi-device merge.
- Legal execution, notarization, court document handling, or third-party account
  takeover.
- Trigger policy simulation or report/check-in behavior changes.
- Backup export/import.
- Remote JavaScript, React component, plugin, or third-party code execution.
- Monorepo physical splitting.

## Existing Constraints

- Reuse the archived `local-trust-data-model` contracts for `ITrustedHelper`,
  `ITrustItem.helperIds`, and `ITrustDataSnapshot`.
- Reuse the local item CRUD behavior from `local-item-crud-workflow`; do not
  replace or regress existing item create/edit/archive behavior.
- Keep `src/app/*` route modules thin: navigation, i18n assembly, and store
  binding only.
- Keep page UI under `src/pages/*`.
- Keep durable trust data logic under `src/store/trust`.
- Do not modify `.ai/`.
- New user-visible copy must be synchronized across `src/locals/zh-CN.json`,
  `src/locals/zh-TW.json`, and `src/locals/en-US.json`.
- Product language must remain gentle and precise. Prefer terms like "托付",
  "协助人", "联系方法", and "下一步说明"; avoid implying automatic execution,
  legal authority, or direct third-party account control.
