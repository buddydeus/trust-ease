# Add Local Trigger Policy Simulation

## Why

Trust Ease now has a local trust snapshot, item CRUD, and helper/contact
management. The next standalone MVP gap is that the snapshot already contains a
`triggerPolicy`, and the product has a `trigger-state` surface, but the user
cannot yet understand or rehearse what the local trigger policy means.

For this sensitive product category, the app must not present a trigger as an
automatic execution switch. Users need a calm local simulation that explains
check-in cadence, missed check-in thresholds, warning states, pause/resume
behavior, and the next safe action before any future networked notification or
execution workflow exists.

This change adds local-only trigger policy simulation and status explanation.
It must remain reversible, non-networked, and non-operative: the app may record
and preview local state, but it must not send messages, push notifications,
emails, SMS, legal notices, or third-party account actions.

## What Changes

- Add local trigger policy mutation and simulation behavior backed by the
  existing `ITrustDataSnapshot.triggerPolicy`.
- Let the app explain check-in interval, missed check-in threshold, and whether
  missing-state detection or simulation is enabled.
- Add a local simulation state model for safe states such as normal, warning,
  waiting for confirmation, paused, and simulated missing-state review.
- Expose user-facing actions to run a rehearsal, pause monitoring, resume
  monitoring, and reset the local simulation where appropriate.
- Keep all simulation output local and clearly labelled as a rehearsal or local
  preview.
- Show the current trigger status and next recommended action on the existing
  `trigger-state` surface or another existing product surface.
- Preserve existing item, helper, onboarding, reporting, skin runtime, and local
  trust storage behavior.
- Add focused tests for policy mutation, state derivation, safe failure
  behavior, route/page rendering, and copy boundaries.
- Update `zh-CN`, `zh-TW`, and `en-US` copy for all new visible labels, states,
  actions, and warnings.

## Success Criteria

- A user can view the current local trigger policy in understandable language.
- A user can run a local rehearsal/simulation without sending any real message
  or contacting any helper.
- A user can pause and resume local trigger monitoring semantics without
  deleting items, helpers, or reporting records.
- The simulation can derive clear local statuses from policy fields and
  injected timestamps in tests.
- The UI explains that simulation is local, reversible, and not legal execution
  or automatic third-party account control.
- A single missed check-in is never presented as an irreversible execution
  event.
- Existing local trust snapshot data is preserved during policy updates and
  simulation changes.
- New user-visible copy exists in `zh-CN`, `zh-TW`, and `en-US`.
- The change introduces no backend, sync, push notification, SMS, email,
  contacts permission, real helper notification, or remote execution behavior.

## Scope

In scope:

- Local trigger policy read/update helpers under `src/store/trust` if needed.
- A pure or dependency-injected simulation/status resolver that can be tested
  outside React.
- UI updates to `trigger-state` or a nearby existing product surface to show
  current local status and next action.
- Local-only rehearsal actions such as simulate, pause, resume, and reset.
- Gentle explanatory copy and tests for non-operative language.
- Focused unit and page/route tests.

Out of scope:

- Backend accounts, cloud sync, identity verification, remote check-ins, or
  multi-device state merge.
- Real push notifications, SMS, email, phone calls, or helper notifications.
- Device contacts permission or address-book reads.
- Legal execution, notarization, court document handling, or third-party account
  takeover.
- Automatic escalation to helpers or external systems.
- Backup export/import.
- Monorepo physical splitting.
- Skin runtime or remote skin behavior changes.

## Existing Constraints

- Reuse `ILocalTriggerPolicy` from `src/store/trust/types.ts`.
- Preserve the existing versioned local trust snapshot contract.
- Keep route files focused on i18n, navigation, and store/storage binding.
- Keep page UI under `src/pages/*`.
- Keep durable trust data logic under `src/store/trust`.
- Do not modify `.ai/`.
- New user-visible copy must be synchronized across `src/locals/zh-CN.json`,
  `src/locals/zh-TW.json`, and `src/locals/en-US.json`.
- Product language must remain calm and precise. Prefer "演练", "预警",
  "暂停", "恢复", "本地状态", and "下一步" over frightening or irreversible
  wording.
- High-risk actions must explain what will happen before the user acts.
