# Tasks

## 1. Add local readiness resolver

- [ ] Add pure readiness types and resolver under `src/store/trust`.
- [ ] Derive active item and active helper counts from the existing snapshot.
- [ ] Derive item-helper coverage using active helpers only.
- [ ] Derive trigger readiness from existing trigger policy or simulation
      context.
- [ ] Return stable gap and next-action identifiers for UI mapping.
- [ ] Ensure resolver does not mutate the input snapshot.
- [ ] Cover resolver behavior with focused trust store tests.

## 2. Add readiness summary UI

- [ ] Add or extend a page-level component to render readiness headline,
      sections, counts, local-only explanation, and next actions.
- [ ] Keep page component prop-driven and free of direct AsyncStorage access.
- [ ] Avoid numeric grades, harsh pass/fail labels, legal completion claims, and
      automatic delivery wording.
- [ ] Cover rendering and action callback behavior with focused page tests.

## 3. Wire readiness to existing local flows

- [ ] Load the local trust snapshot in the chosen route or parent surface.
- [ ] Map readiness next actions to existing item creation, helper creation,
      item edit/assignment, and trigger-state flows.
- [ ] Keep route code limited to i18n, storage binding, readiness mapping, and
      navigation callbacks.
- [ ] Preserve existing onboarding, home, items, helper, trigger-state, and My
      page behavior outside the new summary entry.
- [ ] Cover route or parent-surface integration with focused tests.

## 4. Update localization and copy boundaries

- [ ] Add readiness summary copy to `zh-CN`, `zh-TW`, and `en-US`.
- [ ] Ensure copy states that readiness is local, advisory, and reversible.
- [ ] Ensure copy does not imply legal authority, notarization, helper delivery,
      backend sync, or third-party account control.
- [ ] Run `pnpm check:local`.
- [ ] Cover unsafe wording boundaries with focused tests.

## 5. Final verification

- [ ] Run `pnpm test tests/store/trust --runInBand`.
- [ ] Run focused page tests for the readiness surface.
- [ ] Run `pnpm check:type`.
- [ ] Run `pnpm check:local`.
- [ ] Run `npm.cmd exec -- openspec validate add-local-readiness-summary --strict`.
- [ ] Run `npm.cmd exec -- openspec validate --all --strict`.
- [ ] Run `git diff -- .ai`.
