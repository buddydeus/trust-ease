# Build Plan: add-skin-runtime-status-ui

## Source

- Change: `openspec/changes/add-skin-runtime-status-ui/`
- Proposal: `openspec/changes/add-skin-runtime-status-ui/proposal.md`
- Design: `openspec/changes/add-skin-runtime-status-ui/design.md`
- Specs: `openspec/changes/add-skin-runtime-status-ui/specs/`
- Tasks: `openspec/changes/add-skin-runtime-status-ui/tasks.md`

## Implementation Checklist

### 1. Define My page skin status props and copy

- [x] Extend `src/pages/my/types.ts` with `ISkinRuntimeStatus`.
- [x] Add copy fields for active skin, init state, fallback note, and package states.
- [x] Keep props limited to display-ready runtime state rather than downloader internals.
- [x] Verify with `pnpm check:type`.

### 2. Add focused My page status tests

- [x] Add ready/default runtime status coverage.
- [x] Add fallback note coverage.
- [x] Add failed and incompatible package state coverage.
- [x] Preserve existing skin picker behavior coverage.
- [x] Verify with `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.

### 3. Implement skin runtime status UI

- [x] Add `src/pages/my/SkinRuntimeStatus.tsx`.
- [x] Render active skin display name, init status, fallback note, and package state rows.
- [x] Keep the card compact and aligned with the existing My page visual system.
- [x] Prefer skin display names over raw package keys when metadata exists.

### 4. Wire store state through the My route

- [x] Select `activeSkinId`, `skinInitStatus`, `skinInitUsedFallback`, and `skinPackageStates`.
- [x] Pass status data into `MyScreen`.
- [x] Keep route imports away from downloader, remote adapter, parser, and package validation internals.
- [x] Verify with `pnpm test tests/support/source-structure.test.ts --runInBand`.

### 5. Add three-locale copy and i18n coverage

- [x] Add new user-visible copy to `src/locals/zh-CN.json`.
- [x] Add matching copy to `src/locals/zh-TW.json`.
- [x] Add matching copy to `src/locals/en-US.json`.
- [x] Update focused My page i18n coverage.
- [x] Verify with `pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand`.
- [x] Verify with `pnpm test tests/i18n --runInBand`.

### 6. Final verification

- [x] Run `npm.cmd exec -- openspec validate add-skin-runtime-status-ui --strict`.
- [x] Run `pnpm check:type`.
- [x] Run `pnpm test tests/pages/my/my-screen.test.tsx --runInBand`.
- [x] Run `pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand`.
- [x] Run `pnpm test tests/i18n --runInBand`.
- [x] Run `pnpm test tests/support/source-structure.test.ts --runInBand`.
- [x] Run `git diff -- .ai`.

## Result

Build implementation is complete. The My page now exposes a compact skin runtime status card backed by store state, with locale coverage and focused tests for ready, fallback, failed, and incompatible package states.
