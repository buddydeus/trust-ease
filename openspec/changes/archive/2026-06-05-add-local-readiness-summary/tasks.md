# Tasks

## 1. Add local readiness resolver

- [x] Add pure readiness types and resolver under `src/store/trust`.
- [x] Derive active item and active helper counts from the existing snapshot.
- [x] Derive item-helper coverage using active helpers only.
- [x] Derive trigger readiness from existing trigger policy or simulation
      context.
- [x] Return stable gap and next-action identifiers for UI mapping.
- [x] Ensure resolver does not mutate the input snapshot.
- [x] Cover resolver behavior with focused trust store tests.

## 2. Add readiness summary UI

- [x] Add or extend a page-level component to render readiness headline,
      sections, counts, local-only explanation, and next actions.
- [x] Keep page component prop-driven and free of direct AsyncStorage access.
- [x] Avoid numeric grades, harsh pass/fail labels, legal completion claims, and
      automatic delivery wording.
- [x] Cover rendering and action callback behavior with focused page tests.

## 3. Wire readiness to existing local flows

- [x] Load the local trust snapshot in the chosen route or parent surface.
- [x] Map readiness next actions to existing item creation, helper creation,
      item edit/assignment, and trigger-state flows.
- [x] Keep route code limited to i18n, storage binding, readiness mapping, and
      navigation callbacks.
- [x] Preserve existing onboarding, home, items, helper, trigger-state, and My
      page behavior outside the new summary entry.
- [x] Cover route or parent-surface integration with focused tests.

## 4. Update localization and copy boundaries

- [x] Add readiness summary copy to `zh-CN`, `zh-TW`, and `en-US`.
- [x] Ensure copy states that readiness is local, advisory, and reversible.
- [x] Ensure copy does not imply legal authority, notarization, helper delivery,
      backend sync, or third-party account control.
- [x] Run `pnpm check:local`.
- [x] Cover unsafe wording boundaries with focused tests.

## 5. Final verification

- [x] Run `pnpm test tests/store/trust --runInBand`.
- [x] Run focused page tests for the readiness surface.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm check:local`.
- [x] Run `npm.cmd exec -- openspec validate add-local-readiness-summary --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
