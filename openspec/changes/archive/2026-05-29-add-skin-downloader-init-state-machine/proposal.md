# Add Skin Downloader Init State Machine

## Why

The skin runtime already has bundled manifest parsing, compatibility checks,
runtime storage paths, persisted skin selection state, and a thin root-layout
startup hook. The next skin milestone needs a controlled downloader and an app
initialization state machine so downloaded skins can be checked, stored, made
ready, selected, and recovered without mixing route code, UI code, persistence
code, and skin package validation.

This is needed before adding more skin packages because the current system can
represent package states, but it does not yet define the end-to-end lifecycle
for downloaded skin packages or the startup sequence that decides which skin is
safe to render.

## What Changes

- Add a skin downloader lifecycle for remote or externally provided skin
  packages.
- Store downloaded skin packages only under Expo FileSystem
  `documentDirectory/skins/`, never under the project-root `skins/` directory.
- Require downloaded packages to be complete and validated before they can
  become `ready` or be activated.
- Reuse the existing skin manifest parser, compatibility checks, feature version
  rules, package state model, and `SkinRuntime` read-only snapshot behavior.
- Add an app initialization state machine that coordinates skin storage
  hydration, bundled fallback availability, downloaded package readiness,
  incompatibility handling, and recovery from failed or partial downloads.
- Keep `src/app` thin by delegating startup orchestration to focused hooks or
  runtime helpers, with UI receiving stable init/skin state rather than owning
  downloader logic.
- Preserve product behavior and current pages while making skin loading states
  explicit enough for tests and future UI affordances.

## Goals

- Define a deterministic startup sequence for skin-related initialization.
- Make downloaded skin package transitions explicit:
  `idle`, `checking`, `downloading`, `ready`, `failed`, and `incompatible`.
- Ensure the app always has a safe bundled fallback skin when a downloaded skin
  fails validation, is incomplete, or is incompatible with the current app
  feature version.
- Prevent partial downloads or corrupt manifests from becoming active.
- Keep the existing controlled skin model: local components plus manifest-driven
  layout, with no remote arbitrary React component execution.
- Add focused tests for downloader state transitions, storage recovery, path
  boundaries, compatibility outcomes, and startup fallback behavior.

## Non-Goals

- Do not redesign the skin picker UI or broader product flows in this change.
- Do not add arbitrary remote component execution, remote JavaScript execution,
  or a plugin/component marketplace.
- Do not implement account, payment, or user-authenticated skin distribution.
- Do not make project-root `skins/` writable at mobile runtime.
- Do not change the supported locales or add new product copy unless a minimal
  loading/error state requires it.
- Do not restructure the repository into a physical monorepo in this change.

## Expected Scope

### Skin Downloader Runtime

Introduce a skin-local downloader/runtime module under `src/skin/` that can:

- resolve the runtime package directory for a skin;
- download or stage package files into a temporary location;
- verify manifest shape, package hash, asset hashes, and feature compatibility;
- atomically promote a verified package to ready storage;
- mark failures without losing the last known ready bundled or downloaded skin;
- avoid leaving partial package data treated as valid.

### Init State Machine

Introduce an initialization state model that coordinates:

- cold start with no persisted skin state;
- persisted active skin that is still ready;
- selected skin whose package is missing or failed;
- downloaded skin that is incompatible with the current app;
- fallback to the bundled default skin;
- persistence of the resolved active/last-ready skin state.

The state machine should be testable outside of React where practical, with a
small route-layer hook connecting it to `RootLayout` or app startup.

### Store and UI Boundary

Expose enough state through existing store/runtime boundaries so screens can
render current skin status and selection outcomes without importing downloader
internals. Page-level UI should continue to receive callbacks/data through props.

### Documentation and Tests

Update human-facing docs only where they describe skin runtime behavior. Keep
`.ai/` unchanged. Tests should cover the skin runtime and startup contracts with
focused unit tests before any broad UI regression.

## Success Criteria

- A downloaded skin cannot become active unless its package is complete,
  manifest-valid, hash-valid, and compatible.
- Startup always resolves to a renderable skin runtime, falling back to the
  bundled default when needed.
- Failed or partial downloads are persisted as non-ready and do not overwrite
  `lastReadySkinId`.
- Route code does not contain downloader implementation details.
- Existing skin parser, compatibility, runtime, storage, My page, and structure
  tests continue to pass.
- `.ai/` remains unchanged.

## Constraints

- Follow the active structure contract:
  `src/app` for route/app shell, `src/pages` for UI, `src/store` for state
  aggregation, and `src/skin` for skin package/runtime logic.
- Use Expo FileSystem runtime storage under `documentDirectory/skins/`.
- Preserve `skins/skin-001/manifest.json` as build-time bundled source only.
- Preserve the three current locales: `zh-CN`, `zh-TW`, `en-US`.
- Keep TypeScript strict mode and existing interface/export style.
- Prefer focused `tests/skin/*` coverage for downloader and state-machine logic.

## Open Questions

- Should the first implementation support a real network URL source, or should
  it start with a local/staged package source abstraction that can later be wired
  to network download?
- Should package integrity use the existing manifest `packageHash` over a
  deterministic package archive, or a manifest plus per-asset hash strategy for
  the first version?
- What minimal UI state should be exposed in this change: silent fallback only,
  or visible checking/downloading/failed/incompatible statuses in the My page?
- Should retry/backoff behavior be part of this change, or deferred until a
  real distribution endpoint exists?
