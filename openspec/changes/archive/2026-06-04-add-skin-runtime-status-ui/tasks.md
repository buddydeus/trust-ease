# Tasks

## 1. Define My page skin status props and copy

- [x] Extend My page prop/copy types with skin runtime status data and labels.
- [x] Decide a small display model for active skin, init status, fallback note,
      and package state rows.
- [x] Keep page props independent from downloader internals.
- [x] Run `pnpm check:type`.

## 2. Add focused My page status tests

- [x] Extend `tests/pages/my/my-screen.test.tsx` for ready/default status.
- [x] Add fallback status coverage.
- [x] Add failed package and incompatible package coverage.
- [x] Ensure existing skin picker behavior remains covered.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.

## 3. Implement skin runtime status UI

- [x] Add a local My page component such as `SkinRuntimeStatus.tsx`.
- [x] Render active skin display name, initialization status, fallback note,
      and known package state rows.
- [x] Keep the section compact and visually consistent with existing My page
      cards.
- [x] Avoid raw package keys when display metadata is available.

## 4. Wire store state through the My route

- [x] Update `src/app/(tabs)/my.tsx` to select store-backed skin status fields.
- [x] Pass status data to `MyScreen` through props.
- [x] Do not import downloader, remote source adapter, manifest parser, or
      package validation helpers into route files.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.

## 5. Add three-locale copy and i18n coverage

- [x] Add new user-visible copy to `src/locals/zh-CN.json`.
- [x] Add matching copy to `src/locals/zh-TW.json`.
- [x] Add matching copy to `src/locals/en-US.json`.
- [x] Add or update focused i18n tests for My page keys.
- [x] Run `pnpm test tests/i18n --runInBand`.

## 6. Final verification

- [x] Run `npm.cmd exec -- openspec validate add-skin-runtime-status-ui --strict`.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [x] Run `pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand`.
- [x] Run `pnpm test tests/i18n --runInBand`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `git diff -- .ai`.
