# Design: Add Local Trigger Policy Simulation

## Overview

This change turns the existing trigger-state prototype into a local-only
simulation surface for the standalone MVP. The app already persists
`ITrustDataSnapshot.triggerPolicy`; this change makes that policy explainable
and safely rehearseable without adding any external delivery or execution
behavior.

The implementation should preserve the current architecture:

- route modules assemble i18n copy, bind local trust storage/helpers, and handle
  persistence;
- page components render trigger status and actions through props and callbacks;
- pure trigger policy helpers live under `src/store/trust/`;
- AsyncStorage remains the only durable persistence layer.

No backend, sync, push notification, SMS, email, contacts permission, helper
notification, legal execution, or third-party account action is introduced.

## Local Data Model

Use the existing `ILocalTriggerPolicy` as the durable policy contract:

- `missedCheckInThreshold`
- `checkInIntervalDays`
- `missingStateEnabled`
- `simulationEnabled`
- `updatedAt`

This change should not require a schema migration. If implementation needs
ephemeral simulation state, prefer deriving it from injected timestamps and
policy inputs, or storing route/page-local simulation state outside the durable
snapshot. If durable state becomes necessary during build, it should be added
only through a separate OpenSpec amend because that changes the trust snapshot
contract.

## Trigger Policy Helpers

Add narrowly scoped pure helpers under `src/store/trust/`, likely
`triggerPolicy.ts`, for:

- update trigger policy fields;
- enable and disable missing-state semantics;
- enable and disable local simulation semantics;
- reset simulation-related flags to the calm default;
- derive a local trigger status from policy fields and an injected clock.

Pure helpers should:

- not mutate the input snapshot;
- validate numeric thresholds and intervals as positive finite numbers;
- clamp or reject invalid values consistently;
- preserve unrelated `items`, `helpers`, and existing snapshot fields;
- update `triggerPolicy.updatedAt` and snapshot `updatedAt` from caller-provided
  timestamps;
- return explicit failure reasons for invalid input.

## Simulation Status Model

The UI needs a small, stable status vocabulary. Suggested values:

- `normal`: monitoring semantics are calm or disabled;
- `paused`: missing-state semantics are disabled or paused;
- `warning`: simulation shows missed check-ins approaching the threshold;
- `waiting-confirmation`: simulation shows the user would be asked to confirm
  before any future escalation;
- `simulated-review`: simulation reached the configured threshold and is showing
  a local review state, not execution.

The exact internal names may differ, but user-visible text must distinguish
rehearsal from real operation and must never imply immediate irreversible
execution.

## Route and Page Shape

`src/app/my/trigger-state.tsx` should remain thin:

- load the local trust snapshot;
- map `triggerPolicy` into a trigger view model;
- pass copy, view model, and callbacks to `TriggerStateScreen`;
- persist validated helper results through trust storage.

`src/pages/trigger-state/TriggerStateScreen.tsx` should own the visual
presentation and call callbacks. It should not import AsyncStorage or mutation
helpers directly.

The existing route path and page component can be reused. A new page component
is not necessary unless implementation finds the current component too dense.

## UI and Copy

The current prototype copy includes direct "death = missed check-ins" wording.
This change should replace that with gentler, reversible language. The trigger
state surface should explain:

- current check-in cadence;
- current missed-check-in threshold;
- whether missing-state semantics are paused or enabled;
- whether the user is viewing a local rehearsal;
- what the next safe action is.

User actions may include:

- run rehearsal;
- pause;
- resume;
- reset rehearsal.

High-risk action labels should be calm and concrete. They should explain what
will happen before the user acts. The UI must not use copy that suggests a
single missed check-in means death, legal execution, or automatic delivery.

## Compatibility

- Existing local trust data parsing remains valid.
- Existing item CRUD and helper/contact workflows should continue to pass.
- Existing onboarding, reporting, skin runtime, remote skin QA, and screenshot
  behavior should not change.
- `src/app/*` route boundary and `src/pages/*` UI boundary remain intact.
- No user-visible copy may be added in only one locale.

## Validation Strategy

Focused tests should cover:

- valid policy updates preserve unrelated snapshot data;
- invalid interval or threshold values fail safely;
- pause/resume updates only trigger policy fields and timestamps;
- local status derivation covers normal, paused, warning,
  waiting-confirmation, and simulated-review states;
- route loads local trigger policy and saves pause/resume/simulation actions;
- page renders current policy, local-only explanation, next action, and actions;
- old direct "death = missed check-ins" copy is no longer present;
- locale check passes after copy changes.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/trigger-state --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-trigger-policy-simulation --strict
```
