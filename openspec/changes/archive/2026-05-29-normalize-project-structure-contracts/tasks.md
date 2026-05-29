# Tasks

## 1. Strengthen structure contract tests

- [x] Extend `tests/support/source-structure.test.ts` to check current root
      documentation references, active directory roles, and screenshot command
      contracts.
- [x] Add route-boundary assertions that keep `src/app` focused on route
      wrappers, navigation, startup hooks, and provider composition.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 2. Align root documentation

- [x] Update root documentation that contradicts current source boundaries or
      screenshot command behavior.
- [x] Preserve `.ai/` unchanged and use it only as read-only context.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 3. Extract root layout side-effect helpers

- [x] Move preview route redirection out of `src/app/_layout.tsx` into a focused
      route-layer helper or hook.
- [x] Move skin storage hydration and persistence subscription out of
      `src/app/_layout.tsx` into a focused route-layer helper or hook.
- [x] Move preview-ready DOM marker handling out of `src/app/_layout.tsx` into a
      focused route-layer helper or hook.
- [x] Keep `RootLayout` responsible for provider and stack composition.
- [x] Run route/layout-related tests and `pnpm check:type`.

## 4. Split the My screen into local page components

- [x] Extract reusable local types for `MyScreen` props, copy, and skin options
      under `src/pages/my/`.
- [x] Extract the trigger/identity/status card composition into focused
      `src/pages/my/` components.
- [x] Extract the language picker into a focused `src/pages/my/` component.
- [x] Extract the skin picker into a focused `src/pages/my/` component.
- [x] Preserve the exported `MyScreen` component and current props API.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.

## 5. Split skin manifest parser internals if needed

- [x] Move manifest whitelist definitions and field reader helpers into
      skin-local files if doing so improves parser readability.
- [x] Keep `parseSkinManifest` and `SkinManifestParseError` behavior stable.
- [x] Preserve current manifest parse error semantics unless tests document a
      deliberate improvement.
- [x] Run `pnpm test tests/skin/manifest.test.ts --runInBand`.

## 6. Final verification

- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [x] Run `pnpm test tests/skin/manifest.test.ts --runInBand` if skin parser
      files changed.
- [x] Run `pnpm test tests/support/export-scripts.test.ts --runInBand` if docs
      or script contracts changed.
- [x] Run `pnpm check:type`.
- [x] Confirm `git diff -- .ai` is empty.
