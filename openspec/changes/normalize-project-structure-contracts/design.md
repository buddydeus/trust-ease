# Design: Normalize Project Structure Contracts

## Context

The app already has a working Expo Router architecture with route wrappers in
`src/app`, screen implementations in `src/pages`, shared runtime helpers in
`src/store`, and skin package/runtime logic in `src/skin`. The refactor should
make those boundaries explicit and mechanically protected before future skin
downloader and init state-machine work adds more persistence and startup
behavior.

This change is intentionally behavior-preserving. It restructures boundaries,
tests, and documentation contracts; it does not add product capabilities.

## Decisions

### Structure Enforcement

Use `tests/support/source-structure.test.ts` as the executable architecture
contract. Extend it with targeted checks instead of creating a broad linter.

The test should enforce facts that are stable and valuable:

- active source references do not point back to retired directory names;
- root docs mention current active directories and screenshot scripts;
- route wrappers stay thin by avoiding direct definitions of large screen
  components, business parsers, manifest parsing, or storage helper
  implementations;
- implementation tests remain free to import route wrappers, screen components,
  and runtime helpers through current public paths.

Avoid fragile metrics such as exact line-count limits. File size can be used as
an investigation signal during implementation, but it should not be a hard
project contract.

### Documentation Alignment

Update only root-level human/agent guidance when it contradicts current code.
The `.ai/` directory is an input for context and remains untouched.

README should remain concise and project-facing. AGENTS-style guidance should
carry agent-specific rules. Both should agree on:

- active directory roles;
- locale set: `zh-CN`, `zh-TW`, `en-US`;
- `pnpm design` using `scripts/render_current_app_screens.py`;
- `pnpm thumbs` using `scripts/capture_runtime_thumbs.js`;
- `skins/` being build-time bundled skin input, not mobile runtime storage.

### Route Boundary Cleanup

Refactor `src/app/_layout.tsx` first because it sits at app startup and currently
mixes three effects:

- preview route redirection;
- skin storage hydration and persistence subscription;
- preview-ready DOM markers for runtime screenshots.

Move each effect into focused local hooks under `src/app/` or a nearby support
module, then keep `RootLayout` responsible for composing providers and stack
screens. This preserves the route-layer contract while reducing startup
complexity.

### Page Boundary Cleanup

Refactor `src/pages/my/MyScreen.tsx` as the representative page-layer cleanup.
Split the language picker, skin picker, status cards, and type contracts into
local page files under `src/pages/my/`.

The split should preserve the same public `MyScreen` component API and visual
output. The page should continue to receive behavior through props and keep
route/store wiring outside the screen.

### Skin Manifest Boundary Cleanup

Refactor `src/skin/manifest.ts` only if the route and page boundary cleanup
lands cleanly. The target is to isolate manifest field readers, whitelist
definitions, and page parsing helpers while preserving the exported
`parseSkinManifest` behavior and `SkinManifestParseError` error semantics.

This prepares for downloader work by making it easier to reuse manifest parsing
for bundled and downloaded skin packages.

## Architecture

```text
src/app/
  Route wrappers and app shell
  - binds router, i18n, preview hooks, startup side effects
  - does not own screen UI or skin manifest parsing

src/pages/
  Screen-level UI composition
  - receives behavior through props
  - can split local controls/components beside each screen

src/store/
  App state and side-effect helper aggregation
  - onboarding, reporting, preview helpers stay behind store/index.ts

src/skin/
  Skin package and runtime contract
  - types, compatibility, manifest parsing, registry, runtime, storage

tests/support/
  Executable repository structure contracts
```

## Data and Control Flow

Route wrappers import screen components and store/runtime helpers:

```text
src/app/* -> src/pages/*
src/app/* -> src/store
src/app/* -> src/skin only for app-shell startup hooks when needed
```

Page components do not import Expo Router. They receive callbacks and data via
props, then render UI.

Skin parsing remains independent from route and page code. Runtime snapshot
consumers read parsed manifests through existing skin exports.

## Migration Strategy

1. Update structure-contract tests so drift is caught before source refactors.
2. Align root documentation with the current scripts and directory roles.
3. Extract root layout effects into focused helpers while preserving behavior.
4. Split `MyScreen` into local page components while preserving tests.
5. Split skin manifest parsing helpers only where it improves downloader
   readiness and keeps public exports stable.
6. Run focused tests after each boundary change, then run type checking.

## Risks and Mitigations

- **Risk:** Structure tests become too brittle.
  **Mitigation:** Test stable import/path contracts and doc expectations, not
  exact line counts.

- **Risk:** Root layout extraction changes async skin hydration timing.
  **Mitigation:** Preserve the existing effect order and keep the same
  `loadSkinStorageState` / `saveSkinStorageState` calls.

- **Risk:** `MyScreen` split changes accessibility labels or picker behavior.
  **Mitigation:** Keep current tests green and add focused assertions around
  language and skin picker interactions if missing.

- **Risk:** Manifest parser split changes error strings.
  **Mitigation:** Preserve current `SkinManifestParseError` messages unless a
  test is intentionally updated to match a clearer documented message.

## Verification

Minimum verification for implementation:

- `pnpm test tests/support/source-structure.test.ts --runInBand`
- `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`
- `pnpm test tests/skin/manifest.test.ts --runInBand` if skin parser files are
  changed
- `pnpm test tests/support/export-scripts.test.ts --runInBand` if docs or
  script contracts are updated
- `pnpm check:type`

If `pnpm` is unavailable in the local execution environment, the implementation
handoff must record the failed command and reason.
