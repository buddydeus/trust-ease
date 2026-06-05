# Tasks

## 1. Define local trust contracts

- [ ] Create `src/store/trust/types.ts` with schema version, snapshot, item,
      helper, trigger policy, status, and item-kind contracts.
- [ ] Ensure durable fields cover ids, titles/names, helper assignments,
      archived status, created timestamps, and updated timestamps.
- [ ] Export only stable type and constant names needed by later phases.
- [ ] Keep contracts local-only and free of backend, sync, or remote execution
      concepts.

## 2. Add default snapshot and pure helpers

- [ ] Create `src/store/trust/defaults.ts` with a complete default snapshot
      factory.
- [ ] Add pure helpers for active trust items, archived trust items, and active
      trusted helpers.
- [ ] Ensure helper functions do not mutate the input snapshot.
- [ ] Add a trust store barrel export if the project has a matching local
      pattern.

## 3. Add AsyncStorage persistence

- [ ] Create `src/store/trust/storage.ts` with load, save, and clear helpers.
- [ ] Use a namespaced AsyncStorage key for the local trust snapshot.
- [ ] Safely parse stored JSON and return defaults for missing, malformed, or
      structurally invalid data.
- [ ] Return defaults for missing schema versions and unsupported future schema
      versions.
- [ ] Save valid snapshots as deterministic JSON.

## 4. Cover storage and selector behavior with tests

- [ ] Create `tests/store/trust/storage.test.ts`.
- [ ] Test empty storage returns the default snapshot.
- [ ] Test malformed JSON returns the default snapshot without throwing.
- [ ] Test structurally invalid storage returns the default snapshot.
- [ ] Test valid snapshots save and reload.
- [ ] Test unsupported future versions fall back to the default snapshot.
- [ ] Test active and archived helpers preserve archived data while filtering
      active views.
- [ ] Test clearing local trust storage removes the AsyncStorage entry.

## 5. Final verification

- [ ] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`.
- [ ] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`.
- [ ] Run `npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict`.
- [ ] Run `npm.cmd exec -- openspec validate --all --strict`.
- [ ] Run `git diff -- .ai`.
