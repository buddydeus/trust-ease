# Design: Add Local Readiness Summary

## Overview

This change adds a local-only readiness summary for the standalone MVP. The app
already has local trust items, trusted helpers, item-helper assignments, and
trigger policy simulation; readiness should derive a concise view model from
those existing domains so the user can understand what is recorded and what is
still worth completing.

Readiness is advisory, not authoritative. It must not become a legal checklist,
a safety score, an estate-planning completion claim, or a promise that helpers
will be notified. It should use calm language, identify missing local pieces,
and route the user back to existing local workflows.

The implementation should preserve the current architecture:

- route modules assemble i18n copy, bind local trust storage, and handle
  navigation callbacks;
- page components render the readiness summary through props;
- pure readiness derivation lives under `src/store/trust/`;
- AsyncStorage-backed local trust snapshot remains the only durable
  persistence layer.

No backend, sync, push notification, SMS, email, contacts permission, helper
delivery, legal execution, backup/export, or remote behavior is introduced.

## Readiness Resolver

Add a pure resolver under `src/store/trust/`, likely `readiness.ts`, that accepts
an `ITrustDataSnapshot` and optional trigger simulation input if needed. The
resolver should return a stable view model rather than mutating the snapshot.

Suggested view model shape:

- overall readiness state such as `empty`, `needs-attention`, or
  `ready-for-review`;
- section summaries for items, helpers, assignments, and trigger rehearsal;
- counts for active items, active helpers, covered items, and uncovered active
  items;
- gap identifiers such as `no-active-items`, `no-active-helpers`,
  `items-without-active-helper`, and `trigger-paused-or-not-rehearsed`;
- next-action identifiers that map to existing flows such as create item,
  create helper, review item assignments, and run trigger rehearsal;
- `isLocalOnly: true`.

The exact internal names may differ, but they should be stable enough for tests
and localization mapping.

The resolver must use active records by default:

- active items are items with `status === 'active'`;
- active helpers are helpers with `status === 'active'`;
- an item is covered only when it references at least one active helper;
- archived helpers must not count toward active coverage even if an item still
  contains their ids.

## Data Contract

This change should not require a trust snapshot schema migration. Readiness is
derived from existing fields:

- `ITrustDataSnapshot.items`;
- `ITrustDataSnapshot.helpers`;
- `ITrustItem.helperIds`;
- `ITrustDataSnapshot.triggerPolicy`;
- the existing trigger simulation status resolver if useful.

If implementation discovers a need to persist readiness history, scores, or
acknowledgement timestamps, that should be handled through a separate OpenSpec
amend because it changes the durable trust data contract.

## Page and Route Shape

Prefer surfacing readiness on an existing product surface before adding a new
route. Good candidates are the Home screen, the My screen, or a small focused
screen reached from one of them. The final placement should keep the user flow
simple:

- the user can see the readiness summary without digging through each domain;
- next actions navigate to existing item, helper, or trigger-state flows;
- route files remain thin and do not own presentation complexity;
- page components remain testable by props and callbacks.

If a new focused page is introduced, it must follow existing route/page
boundaries:

- `src/app/*` handles route parameters, i18n, local storage, and navigation;
- `src/pages/*` owns page UI and styling;
- durable trust data logic stays under `src/store/trust`.

## UI and Copy

The summary should be calm and useful rather than evaluative. Recommended
presentation:

- a short local-only explanation;
- a compact status headline;
- a checklist-style set of preparation sections;
- a small number of prioritized next actions;
- clear copy that the app is recording and rehearsing a local plan.

Avoid:

- numeric grades, percentages, or harsh pass/fail labels;
- implying legal validity, notarization, or completed estate planning;
- implying helper delivery, account takeover, or automatic execution;
- frightening direct death wording.

All visible labels, states, explanations, and actions must be localized in
`zh-CN`, `zh-TW`, and `en-US`.

## Compatibility

- Existing local trust snapshots remain valid.
- Existing item CRUD, helper/contact workflow, trigger simulation, onboarding,
  reporting, skin runtime, screenshot, and i18n behavior should not regress.
- The readiness resolver should tolerate missing or empty arrays by deriving
  empty-state gaps from the default snapshot.
- The resolver should not mutate input arrays, nested records, or trigger
  policy fields.
- No user-visible copy may be added in only one locale.

## Validation Strategy

Focused tests should cover:

- empty snapshot derives missing item/helper/trigger gaps;
- active items and active helpers are counted correctly;
- archived items and archived helpers are excluded from active readiness;
- items with only archived helper ids are treated as uncovered;
- mixed covered/uncovered items derive assignment gaps and next actions;
- paused or not-rehearsed trigger context produces a calm trigger gap;
- resolver does not mutate input snapshots;
- page renders readiness summary, local-only explanation, and next actions;
- route or parent surface maps next actions to existing flows;
- unsafe legal, automatic delivery, or harsh score wording is not rendered;
- localization keys exist in `zh-CN`, `zh-TW`, and `en-US`.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-readiness-summary --strict
```
