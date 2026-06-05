# Design: Add Local Trust Item Data Model

## Overview

This change introduces the standalone MVP's local product data foundation. The
app already has local storage precedents for onboarding and skin runtime state,
but trust items, helpers, assignments, and trigger policy need a canonical
snapshot before page workflows start mutating real user data.

The preferred implementation is a small `src/store/trust/` module set:

- `types.ts` defines durable contracts and narrow public types;
- `defaults.ts` creates complete default snapshots and helper defaults;
- `storage.ts` owns AsyncStorage load/save/clear and safe parsing;
- `selectors.ts` or small exported helpers expose active/archived record views
  if that keeps `storage.ts` focused;
- `index.ts` exports the stable surface for later phases.

No route or page should change in this phase. UI CRUD, helper management,
trigger simulation, and backup import/export will consume these contracts in
later OpenFlow changes.

## Data Shape

The snapshot should be versioned explicitly:

```ts
export const TRUST_DATA_SCHEMA_VERSION = 1;

export interface ITrustDataSnapshot {
  schemaVersion: typeof TRUST_DATA_SCHEMA_VERSION;
  items: ITrustItem[];
  helpers: ITrustedHelper[];
  triggerPolicy: ILocalTriggerPolicy;
  updatedAt: string | null;
}
```

Durable ids should be strings. The storage layer should not generate random ids
in this change unless a helper is needed for tests; page workflows can own id
creation later. Timestamps should be ISO strings when present.

Important item fields should cover the MVP contract without forcing full UI
behavior:

- `id`
- `title`
- `kind`: `offline` or `online`
- `summary`
- `helperIds`
- `status`: `active` or `archived`
- `createdAt`
- `updatedAt`

Trusted helper fields should cover assignment and future contact display:

- `id`
- `displayName`
- `relationship`
- `contactMethod`
- `notes`
- `status`: `active` or `archived`
- `createdAt`
- `updatedAt`

Trigger policy should stay local and reversible:

- `missedCheckInThreshold`
- `checkInIntervalDays`
- `missingStateEnabled`
- `simulationEnabled`
- `updatedAt`

## Storage Behavior

Use AsyncStorage with a namespaced key such as:

```ts
const STORAGE_KEY = 'trust-ease:trust-data:v1';
```

Required storage helpers:

- `loadTrustDataSnapshot(): Promise<ITrustDataSnapshot>`
- `saveTrustDataSnapshot(snapshot: ITrustDataSnapshot): Promise<void>`
- `clearTrustDataSnapshot(): Promise<void>`

The loader should never throw for normal data corruption cases. It should return
a complete default snapshot when:

- no stored value exists;
- JSON parsing fails;
- the parsed value is not an object;
- `schemaVersion` is missing, unknown, or unsupported;
- required collection fields are missing or invalid.

Unexpected AsyncStorage infrastructure failures may still reject, matching
existing storage helper behavior unless implementation chooses to normalize them
explicitly.

## Parsing and Versioning

Keep parsing conservative and deterministic. Avoid accepting broad partial data
that later code cannot safely use. For version `1`, accept only structurally
valid arrays and policy objects, then normalize optional nullable fields where
needed.

Future migrations should be centralized behind a function such as
`parseTrustDataSnapshot(raw: unknown): ITrustDataSnapshot`, so later schema
versions can be added without rewriting page workflows.

Unsupported future versions should not crash. For this MVP phase they should
return the default snapshot rather than attempting partial downgrade.

## Selectors and Archive Semantics

Archiving is not deletion. Archived records remain in the snapshot so future
backup/export and audit behavior can preserve user intent.

Provide small helpers such as:

- `getActiveTrustItems(snapshot)`
- `getArchivedTrustItems(snapshot)`
- `getActiveTrustedHelpers(snapshot)`

These helpers should be pure functions and covered by tests. They should not
mutate snapshots.

## Compatibility

- This change does not alter current page rendering.
- This change does not introduce backend APIs, account identity, sync, push
  notification, or remote execution.
- This change does not change skin runtime storage or project-root `skins/`
  semantics.
- This change should keep future monorepo extraction simple by isolating durable
  contracts in `src/store/trust/`.

## Validation Strategy

Focused tests should cover:

- empty AsyncStorage returns default snapshot;
- malformed JSON returns default snapshot;
- structurally invalid snapshot returns default snapshot;
- valid snapshot saves and reloads;
- unsupported future version returns default snapshot;
- active/archived selectors preserve archived records while excluding them from
  active results;
- clear removes the stored snapshot.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust/storage.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-trust-item-data-model --strict
```
