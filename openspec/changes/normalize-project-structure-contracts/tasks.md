# Tasks

## 1. Strengthen structure contract tests

- [ ] Extend `tests/support/source-structure.test.ts` to check current root
      documentation references, active directory roles, and screenshot command
      contracts.
- [ ] Add route-boundary assertions that keep `src/app` focused on route
      wrappers, navigation, startup hooks, and provider composition.
- [ ] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 2. Align root documentation

- [ ] Update root documentation that contradicts current source boundaries or
      screenshot command behavior.
- [ ] Preserve `.ai/` unchanged and use it only as read-only context.
- [ ] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 3. Extract root layout side-effect helpers

- [ ] Move preview route redirection out of `src/app/_layout.tsx` into a focused
      route-layer helper or hook.
- [ ] Move skin storage hydration and persistence subscription out of
      `src/app/_layout.tsx` into a focused route-layer helper or hook.
- [ ] Move preview-ready DOM marker handling out of `src/app/_layout.tsx` into a
      focused route-layer helper or hook.
- [ ] Keep `RootLayout` responsible for provider and stack composition.
- [ ] Run route/layout-related tests and `pnpm check:type`.

## 4. Split the My screen into local page components

- [ ] Extract reusable local types for `MyScreen` props, copy, and skin options
      under `src/pages/my/`.
- [ ] Extract the trigger/identity/status card composition into focused
      `src/pages/my/` components.
- [ ] Extract the language picker into a focused `src/pages/my/` component.
- [ ] Extract the skin picker into a focused `src/pages/my/` component.
- [ ] Preserve the exported `MyScreen` component and current props API.
- [ ] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.

## 5. Split skin manifest parser internals if needed

- [ ] Move manifest whitelist definitions and field reader helpers into
      skin-local files if doing so improves parser readability.
- [ ] Keep `parseSkinManifest` and `SkinManifestParseError` behavior stable.
- [ ] Preserve current manifest parse error semantics unless tests document a
      deliberate improvement.
- [ ] Run `pnpm test tests/skin/manifest.test.ts --runInBand`.

## 6. Final verification

- [ ] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [ ] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [ ] Run `pnpm test tests/skin/manifest.test.ts --runInBand` if skin parser
      files changed.
- [ ] Run `pnpm test tests/support/export-scripts.test.ts --runInBand` if docs
      or script contracts changed.
- [ ] Run `pnpm check:type`.
- [ ] Confirm `git diff -- .ai` is empty.
