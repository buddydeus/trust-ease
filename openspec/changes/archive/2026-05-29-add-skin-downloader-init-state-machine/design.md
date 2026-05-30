# Design: Skin Downloader and Init State Machine

## Context

The current skin system already has these foundations:

- bundled skin manifest loading through `src/skin/registry.ts`;
- strict manifest parsing and compatibility checks under `src/skin/`;
- runtime storage URI helpers that point to Expo FileSystem
  `documentDirectory/skins/`;
- persisted `selectedSkinId`, `activeSkinId`, `lastReadySkinId`, and
  `skinPackageStates`;
- a route-layer `useSkinStorageSync` hook that hydrates and persists skin state;
- a read-only `SkinRuntime` wrapper for UI consumption.

What is missing is an explicit lifecycle for downloaded packages and a
deterministic startup decision tree. Without that, future skin packages risk
being selected before their files are complete, or route/layout code may absorb
package validation and recovery logic.

## Decisions

### Downloader Boundary

Add skin-local downloader logic under `src/skin/`. The downloader should not
live in route files or page files.

The first implementation should use a source abstraction that supports staged
or local test packages and can later be backed by a network download adapter.
This avoids coupling the first lifecycle implementation to a distribution
endpoint that does not exist yet.

The downloader lifecycle is:

```text
idle -> checking -> downloading -> checking -> ready
                         \          \-> failed
                          \-> failed
checking -> incompatible
```

`ready` means the package has a valid manifest, valid integrity checks, and is
compatible with the current app feature version. `incompatible` means the
package is structurally valid but cannot run in the current app version.
`failed` covers incomplete files, invalid manifests, hash mismatch, file-system
errors, and source failures.

### Runtime Package Storage

Downloaded packages must be staged in a temporary runtime location under
`documentDirectory/skins/` and promoted only after validation succeeds.

Promotion should be atomic at the package-directory level as far as Expo
FileSystem allows. The app must never treat a temporary directory or a partial
download as a ready package.

The project-root `skins/` directory remains build-time bundled input only.

### Integrity and Compatibility

Validation should reuse existing parser and compatibility logic:

- parse `manifest.json` with `parseSkinManifest`;
- compare manifest `skinId` against the requested skin;
- verify feature compatibility with `isSkinCompatible`;
- verify declared asset hashes for files present in the package;
- verify package-level integrity through a deterministic package hash strategy.

The exact hashing helper can be introduced during implementation, but the
observable contract is that any mismatch prevents activation.

### Init State Machine

Add a pure, testable init resolver that accepts persisted skin state, bundled
package availability, downloaded package readiness information, and the selected
skin. It returns a resolved startup decision:

- render with the persisted active skin when it is still ready and compatible;
- render with `lastReadySkinId` when the selected or active skin is not ready;
- render with the bundled default skin when persisted ready state is invalid;
- mark incompatible or failed packages without overwriting the last known ready
  skin;
- persist the normalized resolved state.

React hooks should be small adapters around this resolver and existing store
updates.

### Store and UI Exposure

Expose minimal stable state through the existing store boundary:

- package state by package key;
- selected skin id;
- active skin id;
- last ready skin id;
- initialization status enough for screens to show checking/downloading/failed
  or incompatible outcomes later.

This change should not redesign the My page. If a small status label is needed
to make states observable, it must use existing i18n rules and existing page
component boundaries.

### Error Handling

Downloader and init failures are recoverable. They should:

- leave the previous active or last-ready skin intact;
- mark the attempted package `failed` or `incompatible`;
- avoid throwing through root layout during normal recoverable failures;
- surface unrecoverable bundled default absence as a hard error, because the app
  cannot safely render without a bundled fallback.

### Documentation

Update root docs only where they describe skin runtime behavior. `.ai/` remains
unchanged.

## Architecture

```text
src/app/
  useSkinInitialization.ts       route-layer adapter only

src/store/
  useAppStore.ts                 global selected/active/package/init state
  index.ts                       stable exports

src/skin/
  downloader.ts                  source fetch/stage/promote lifecycle
  packageValidation.ts           manifest/hash/compatibility validation
  initStateMachine.ts            pure startup resolver
  storage.ts                     persisted selected/active/package state
  paths.ts                       runtime FileSystem paths
  registry.ts                    bundled skin fallback
  runtime.ts                     read-only runtime snapshots

tests/skin/
  downloader.test.ts
  package-validation.test.ts
  init-state-machine.test.ts
```

The exact filenames can change during implementation if local naming conventions
make a nearby shape clearer, but responsibilities should stay inside the same
boundaries.

## Migration Strategy

1. Add tests for the pure init resolver and package-state transitions.
2. Add package validation helpers using existing manifest and compatibility
   modules.
3. Add downloader staging/promotion helpers using `paths.ts`.
4. Wire resolved init state into store hydration without changing page behavior.
5. Add minimal docs and structure tests for runtime storage boundaries if
   needed.
6. Run focused skin tests, structure tests, My page tests, and type checking.

## Risks and Mitigations

- **Risk:** Package hashing becomes platform-sensitive.
  **Mitigation:** Define a deterministic file ordering and byte/hash strategy in
  tests before wiring activation.

- **Risk:** Startup blocks rendering for too long.
  **Mitigation:** Resolve immediately to the last known ready or bundled skin,
  then update package states asynchronously where possible.

- **Risk:** Downloader failures crash root layout.
  **Mitigation:** Treat validation and file-system errors as package state
  outcomes unless the bundled fallback itself is missing.

- **Risk:** UI starts depending on downloader internals.
  **Mitigation:** Expose only store-level states and callbacks; keep page
  components prop-driven.

- **Risk:** Future remote distribution requires auth or retry behavior.
  **Mitigation:** Use a source adapter boundary now and defer auth, marketplace,
  and backoff policy until there is a concrete endpoint.

## Verification

Minimum verification for implementation:

- `pnpm test tests/skin/init-state-machine.test.ts --runInBand`
- `pnpm test tests/skin/downloader.test.ts --runInBand`
- `pnpm test tests/skin/package-validation.test.ts --runInBand`
- `pnpm test tests/skin/storage.test.ts --runInBand`
- `pnpm test tests/skin/paths.test.ts --runInBand`
- `pnpm test tests/support/source-structure.test.ts --runInBand`
- `pnpm test tests/pages/my/my-screen.test.tsx --runInBand` if My page state is
  exposed
- `pnpm check:type`
- `git diff -- .ai`
