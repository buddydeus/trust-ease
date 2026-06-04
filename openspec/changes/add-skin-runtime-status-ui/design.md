# Design: Add Skin Runtime Status UI

## Overview

The current runtime already stores skin initialization and package lifecycle
state. This change makes that state visible in the My/settings area without
adding new downloader behavior.

The first implementation should be compact and test-friendly:

- a skin status summary near the existing skin picker;
- active skin display name when known;
- initialization status label;
- fallback note when `skinInitUsedFallback` is true;
- package state rows for known package states.

## Key Decisions

### Use My Page as the First Surface

The My/settings page already owns skin picker and configuration affordances, so
it is the least surprising place to show runtime skin status. The status should
sit near the existing skin picker and should not become a top-level alert.

### Do Not Show Raw Package Keys by Default

The UI should prefer display names for known skin ids. Raw package keys such as
`skin-001@1.0.0` are useful internally, but they read as implementation detail.

If a package state cannot be mapped to a display name, the first implementation
may show the skin id portion as a fallback. It should avoid exposing full raw
keys unless a later QA/debug mode explicitly asks for that.

### Show Existing Package Entries Only

The first UI should list known package states that are present in
`skinPackageStates`. It should not invent rows for packages that have never been
seen by the runtime.

This keeps the status section useful for QA while avoiding a noisy checklist of
states that are not relevant on normal installs.

### Fallback Is a Separate, Subtle Note

When `skinInitUsedFallback` is true, display a distinct note such as "Using a
safe fallback style". It should be visible but calm. The copy should not use
alarming phrasing such as "failed permanently" or "broken".

### Route Selects State, Page Formats Display

Route code may select `skinInitStatus`, `skinInitUsedFallback`, active skin id,
and package state map from the store and pass them to `MyScreen`. The My page
or small local helper components can turn that data into display rows.

Route code should not format package status text and should not import
downloader, manifest parsing, or remote adapter modules.

## Proposed Files

Likely implementation files:

- `src/app/(tabs)/my.tsx`
- `src/pages/my/MyScreen.tsx`
- `src/pages/my/SkinRuntimeStatus.tsx`
- `src/pages/my/types.ts`
- `src/locals/zh-CN.json`
- `src/locals/zh-TW.json`
- `src/locals/en-US.json`
- `tests/pages/my/my-screen.test.tsx`
- `tests/pages/my/my-screen.i18n.test.tsx`

Optional helper additions:

- a small skin status display type in `src/pages/my/types.ts`;
- a local formatter helper next to My page components if the component becomes
  crowded.

## Copy Direction

Use calm, plain wording:

- "Style status"
- "Current style"
- "Ready"
- "Checking style"
- "Downloading style"
- "Style unavailable"
- "Style needs app update or another style"
- "Using a safe fallback style"

Chinese copy should prefer "风格" or "界面风格" over technical "皮肤包" when the
message is user-facing.

## Validation Strategy

Focused tests should cover:

- default ready state renders;
- fallback note renders only when fallback happened;
- failed package state renders as unavailable;
- incompatible package state renders as needs update/change;
- skin picker behavior remains unchanged;
- all locale files contain new keys;
- route/page boundary remains clean.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my/my-screen.i18n.test.tsx --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/i18n --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
```

`pnpm check:local` is desirable if the known unused-key baseline is fixed or if
the implementation can run it successfully in this branch.
