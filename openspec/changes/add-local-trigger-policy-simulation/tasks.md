# Tasks

## 1. Add trigger policy mutation helpers

- [ ] Add pure trigger policy update helpers under `src/store/trust`.
- [ ] Validate check-in interval and missed check-in threshold before mutation.
- [ ] Add pause, resume, start simulation, and reset simulation helpers.
- [ ] Preserve unrelated items, helpers, and snapshot fields during policy
      changes.
- [ ] Cover trigger policy helpers with focused trust store tests.

## 2. Add deterministic simulation status resolver

- [ ] Add a pure or dependency-injected status resolver under `src/store/trust`.
- [ ] Derive normal, paused, warning, waiting-confirmation, and
      simulated-review statuses from policy and injected inputs.
- [ ] Return a stable next-action view model for each status.
- [ ] Ensure threshold-reaching states are labelled as local review or rehearsal,
      not execution.
- [ ] Cover resolver behavior with focused trust store tests.

## 3. Update trigger-state page component

- [ ] Extend `TriggerStateScreen` props to accept a trigger policy/status view
      model and action callbacks.
- [ ] Render check-in interval, missed check-in threshold, current local status,
      next action, and local-only explanation.
- [ ] Add user actions for rehearsal, pause, resume, and reset where applicable.
- [ ] Remove direct "death = missed check-ins" style copy from the rendered
      trigger-state UI.
- [ ] Cover trigger-state rendering, actions, and copy safety in page tests.

## 4. Wire trigger-state route to local trust storage

- [ ] Load `ITrustDataSnapshot.triggerPolicy` from local trust storage in the
      trigger-state route.
- [ ] Persist pause, resume, start simulation, reset simulation, and valid policy
      updates through AsyncStorage-backed trust storage.
- [ ] Keep route code limited to i18n, storage binding, view-model mapping, and
      navigation-safe callbacks.
- [ ] Preserve existing route path and unrelated product behavior.
- [ ] Cover route persistence behavior in trigger-state tests.

## 5. Update localization and copy boundaries

- [ ] Add trigger policy simulation copy to `zh-CN`, `zh-TW`, and `en-US`.
- [ ] Replace existing unsafe trigger copy with calm, reversible wording in all
      three locales.
- [ ] Ensure copy states that rehearsal is local and does not contact helpers or
      create legal authority.
- [ ] Run `pnpm check:local`.
- [ ] Cover copy safety with focused tests.

## 6. Final verification

- [ ] Run `pnpm test tests/store/trust --runInBand`.
- [ ] Run `pnpm test tests/pages/trigger-state --runInBand`.
- [ ] Run `pnpm check:type`.
- [ ] Run `pnpm check:local`.
- [ ] Run `npm.cmd exec -- openspec validate add-local-trigger-policy-simulation --strict`.
- [ ] Run `npm.cmd exec -- openspec validate --all --strict`.
- [ ] Run `git diff -- .ai`.
