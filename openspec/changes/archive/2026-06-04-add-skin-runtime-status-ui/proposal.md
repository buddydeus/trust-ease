# Add Skin Runtime Status UI

## Why

The skin runtime now exposes enough state to understand initialization and
package lifecycle outcomes: `skinInitStatus`, `skinInitUsedFallback`, and
`skinPackageStates`. The downloader and remote source adapter can represent
checking, downloading, ready, failed, and incompatible states, but the current
mobile UI does not surface those states to users or testers.

This makes internal QA harder because a fallback, incompatible skin package, or
failed download can be represented in runtime state without any visible screen
showing what happened. The next step should make skin runtime status visible in
a calm, non-alarming way while preserving the existing controlled skin model.

## What Changes

- Add a small skin runtime status surface to the My/settings area.
- Display the current active skin, initialization status, and whether the last
  initialization used a fallback.
- Display package lifecycle state for known skin packages in a concise,
  user-readable way.
- Keep the page connected through store-backed data and props; page components
  must not import downloader internals.
- Add or update tests for My page status rendering.
- Add three-locale copy for any new user-visible text.
- Keep the current skin picker behavior for bundled `skin-001`.

## Goals

- Help internal testers understand whether the app is using the selected skin,
  a fallback skin, or a package in a non-ready state.
- Surface `checking`, `downloading`, `ready`, `failed`, and `incompatible`
  package states without making them look like high-risk user actions.
- Preserve the product tone: calm, clear, and reversible.
- Avoid exposing implementation-heavy terms like raw package keys unless they
  are needed for QA-only diagnostics.
- Keep route files thin and keep remote downloader details inside `src/skin`.
- Keep the change small enough to verify with focused My page, i18n, type, and
  skin tests.

## Non-Goals

- Do not add a real remote skin service or production skin marketplace.
- Do not add a new skin download button unless later specs explicitly expand
  scope.
- Do not redesign the My page or skin picker as a broader visual project.
- Do not execute remote React components, remote JavaScript, or plugin code.
- Do not change the skin downloader, remote source adapter, or init state
  machine semantics unless required to expose already-existing state cleanly.
- Do not physically split the repository into a monorepo.
- Do not modify `.ai/` files.

## Expected Scope

### UI Surface

Add a compact status section in the My/settings page near the existing skin
picker. It should summarize:

- active skin id or display name;
- initialization status;
- fallback status;
- package state entries for known package states.

The presentation should be readable for testers but not overly technical for
future users.

### Store and Route Wiring

Route-level code may select current store state and pass it into the My page.
It should not contain status formatting, downloader logic, manifest parsing, or
remote source behavior.

Page-level code can format display rows from props and localized copy.

### Internationalization

Any new user-visible strings must be added together to:

- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`

The labels should prefer calm terms such as "style is ready", "checking style",
"using fallback style", and "style unavailable" rather than alarming failure
language.

### Tests

Add focused coverage for:

- ready/default status;
- fallback status;
- failed package status;
- incompatible package status;
- three-locale key availability if copy changes.

## Success Criteria

- My/settings UI shows active skin runtime status using existing store state.
- Package states are visible enough for QA to understand ready, checking,
  downloading, failed, and incompatible outcomes.
- User-facing copy is present in all three supported locales.
- Route code remains thin and does not import downloader internals.
- Existing skin picker behavior remains unchanged.
- `pnpm check:type`, relevant My page tests, i18n/local checks or focused i18n
  tests, and source-structure tests pass.
- `.ai/` remains unchanged.

## Constraints

- Preserve supported locales: `zh-CN`, `zh-TW`, and `en-US`.
- Preserve current Expo 55 / React 19 / React Native 0.85 stack.
- Use the existing `src/app`, `src/pages`, `src/store`, and `src/skin`
  boundaries.
- Keep `skins/` as build-time bundled skin source only.
- Do not introduce arbitrary remote component execution.
- Use the pinned pnpm workflow from `dependency-reproducibility`.

## Open Questions

- Should the first UI show raw package keys like `skin-001@1.0.0`, or should it
  map known packages to display names and keep raw keys out of the interface?
- Should failed/incompatible package states appear only when present, or should
  the status section always show a full package-state list for QA visibility?
- Should the fallback message be a subtle inline note, or a distinct status row?
