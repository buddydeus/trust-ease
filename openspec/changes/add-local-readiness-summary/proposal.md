# Add Local Readiness Summary

## Why

Trust Ease now has local trust item storage, item CRUD, helper/contact
management, item-to-helper assignment, and local trigger policy simulation. The
next standalone MVP gap is that the user still has to inspect separate screens
to understand whether their local plan is usable enough for a first calm
review.

For this product category, the app should not turn preparation into a harsh
score, legal compliance claim, or automatic execution promise. Users need a
gentle local summary that explains which pieces are already recorded, which
pieces are still missing, and what the next reversible action should be.

This change adds a local-only readiness summary for the single-device MVP. It
derives its state from existing local trust data and trigger simulation state,
without adding backend accounts, sync, notifications, helper delivery, legal
execution, backup/export, or remote behavior.

## What Changes

- Add a local readiness summary model derived from the existing local trust
  snapshot and trigger policy/simulation state.
- Summarize the key standalone MVP preparation areas:
  - important items recorded;
  - trusted helpers/contacts recorded;
  - item-to-helper assignment coverage;
  - local trigger policy or rehearsal status;
  - local-only storage and non-operative boundaries.
- Provide calm next-action recommendations that route users back to existing
  local flows where possible.
- Surface the summary on an existing product surface or a focused local
  readiness surface without changing onboarding, item CRUD, helper CRUD, or
  trigger simulation semantics.
- Keep readiness advisory. It must not be presented as a safety score, legal
  validity check, estate-planning completion state, or guarantee that helpers
  will be notified.
- Preserve existing local trust snapshot data and avoid mutating items,
  helpers, reporting records, or trigger policy while deriving readiness.
- Add focused tests for readiness derivation, missing-data handling,
  archived-helper behavior, safe next-action ordering, and copy boundaries.
- Update `zh-CN`, `zh-TW`, and `en-US` copy for all new visible labels,
  readiness states, explanations, and actions.

## Success Criteria

- A user can view a concise local readiness summary for the standalone MVP.
- The summary clearly shows which local pieces are present and which are still
  worth completing.
- The summary can identify at least these gaps: no active item, no active
  helper/contact, items without active helper assignment, and missing or paused
  trigger rehearsal context.
- Recommended actions lead to existing local workflows instead of dead ends.
- Readiness derivation is deterministic and testable from injected local
  snapshot/simulation inputs.
- Archived helpers are not counted as active helper coverage by default.
- The UI explains that readiness is local and advisory, not legal execution,
  automatic notification, or third-party account control.
- New user-visible copy exists in `zh-CN`, `zh-TW`, and `en-US`.
- The change introduces no backend, sync, push notification, SMS, email,
  contacts permission, backup/export, legal execution, or remote behavior.

## Scope

In scope:

- A pure or dependency-injected readiness resolver under `src/store/trust` or a
  nearby local domain module.
- A user-facing local readiness summary on an existing page or focused page.
- Navigation/action metadata that points to existing local item, helper, and
  trigger rehearsal flows.
- Focused tests for readiness derivation and page/route integration.
- Calm explanatory copy and non-operative language checks.

Out of scope:

- Backend accounts, cloud sync, remote helper workflow, or multi-device merge.
- Real push notifications, SMS, email, phone calls, or helper delivery.
- Backup export/import, file sharing, or device transfer.
- Legal execution, notarization, court document handling, estate distribution,
  or third-party account takeover.
- New trigger policy semantics beyond reading existing local state.
- New item/helper schema requirements unless the spec proves a small derived
  field is necessary.
- Monorepo physical splitting.
- Skin runtime or remote skin behavior changes.

## Existing Constraints

- Reuse the existing `ITrustDataSnapshot`, item, helper, and trigger policy
  contracts where possible.
- Preserve the versioned local trust snapshot contract and existing migration
  behavior.
- Keep route files focused on i18n, navigation, and store/storage binding.
- Keep page UI under `src/pages/*`.
- Keep durable trust data logic under `src/store/trust`.
- Do not modify `.ai/`.
- New user-visible copy must be synchronized across `src/locals/zh-CN.json`,
  `src/locals/zh-TW.json`, and `src/locals/en-US.json`.
- Product language must remain calm and precise. Prefer "准备度", "本地准备",
  "待补充", "下一步", "演练", and "可随时修改" over frightening,
  irreversible, legal, or automatic-execution wording.
- High-risk or sensitive summary states must explain what the app will and will
  not do before prompting the user to continue.
