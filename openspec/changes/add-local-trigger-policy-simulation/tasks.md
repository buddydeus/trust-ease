# Tasks

## 1. Add trigger policy mutation helpers

- [x] Add pure trigger policy update helpers under `src/store/trust`.
- [x] Validate check-in interval and missed check-in threshold before mutation.
- [x] Add pause, resume, start simulation, and reset simulation helpers.
- [x] Preserve unrelated items, helpers, and snapshot fields during policy
      changes.
- [x] Cover trigger policy helpers with focused trust store tests.

## 2. Add deterministic simulation status resolver

- [x] Add a pure or dependency-injected status resolver under `src/store/trust`.
- [x] Derive normal, paused, warning, waiting-confirmation, and
      simulated-review statuses from policy and injected inputs.
- [x] Return a stable next-action view model for each status.
- [x] Ensure threshold-reaching states are labelled as local review or rehearsal,
      not execution.
- [x] Cover resolver behavior with focused trust store tests.

## 3. Update trigger-state page component

- [x] Extend `TriggerStateScreen` props to accept a trigger policy/status view
      model and action callbacks.
- [x] Render check-in interval, missed check-in threshold, current local status,
      next action, and local-only explanation.
- [x] Add user actions for rehearsal, pause, resume, and reset where applicable.
- [x] Remove direct "death = missed check-ins" style copy from the rendered
      trigger-state UI.
- [x] Cover trigger-state rendering, actions, and copy safety in page tests.

## 4. Wire trigger-state route to local trust storage

- [x] Load `ITrustDataSnapshot.triggerPolicy` from local trust storage in the
      trigger-state route.
- [x] Persist pause, resume, start simulation, reset simulation, and valid policy
      updates through AsyncStorage-backed trust storage.
- [x] Keep route code limited to i18n, storage binding, view-model mapping, and
      navigation-safe callbacks.
- [x] Preserve existing route path and unrelated product behavior.
- [x] Cover route persistence behavior in trigger-state tests.

## 5. Update localization and copy boundaries

- [x] Add trigger policy simulation copy to `zh-CN`, `zh-TW`, and `en-US`.
- [x] Replace existing unsafe trigger copy with calm, reversible wording in all
      three locales.
- [x] Ensure copy states that rehearsal is local and does not contact helpers or
      create legal authority.
- [x] Run `pnpm check:local`.
- [x] Cover copy safety with focused tests.

## 6. Final verification

- [x] Run `pnpm test tests/store/trust --runInBand`.
- [x] Run `pnpm test tests/pages/trigger-state --runInBand`.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm check:local`.
- [x] Run `npm.cmd exec -- openspec validate add-local-trigger-policy-simulation --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
