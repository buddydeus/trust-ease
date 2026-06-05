# Tasks

## 1. Define local trust contracts

- [x] Create `src/store/trust/types.ts` with schema version, snapshot, item,
      helper, trigger policy, status, and item-kind contracts.
- [x] Ensure durable fields cover ids, titles/names, helper assignments,
      archived status, created timestamps, and updated timestamps.
- [x] Export only stable type and constant names needed by later phases.
- [x] Keep contracts local-only and free of backend, sync, or remote execution
      concepts.

## 2. Add default snapshot and pure helpers

- [x] Create `src/store/trust/defaults.ts` with a complete default snapshot
      factory.
- [x] Add pure helpers for active trust items, archived trust items, and active
      trusted helpers.
- [x] Ensure helper functions do not mutate the input snapshot.
- [x] Add a trust store barrel export if the project has a matching local
      pattern.

## 3. Add AsyncStorage persistence

- [x] Create `src/store/trust/storage.ts` with load, save, and clear helpers.
- [x] Use a namespaced AsyncStorage key for the local trust snapshot.
- [x] Safely parse stored JSON and return defaults for missing, malformed, or
      structurally invalid data.
- [x] Return defaults for missing schema versions and unsupported future schema
      versions.
- [x] Save valid snapshots as deterministic JSON.

## 4. Cover storage and selector behavior with tests

- [x] Create `tests/store/trust/storage.test.ts`.
- [x] Test empty storage returns the default snapshot.
- [x] Test malformed JSON returns the default snapshot without throwing.
- [x] Test structurally invalid storage returns the default snapshot.
- [x] Test valid snapshots save and reload.
- [x] Test unsupported future versions fall back to the default snapshot.
- [x] Test active and archived helpers preserve archived data while filtering
      active views.
- [x] Test clearing local trust storage removes the AsyncStorage entry.

## 5. Final verification

- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand`.
- [x] Run `npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type`.
- [x] Run `npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict`.
- [x] Run `npm.cmd exec -- openspec validate --all --strict`.
- [x] Run `git diff -- .ai`.
