# Add Local Trust Item Data Model

## Why

Trust Ease is moving from a polished Expo prototype toward a standalone app MVP.
The current UI already presents important items, reporting/check-in, trigger
state, and My/settings surfaces, but most product data is still static page
copy or isolated runtime state.

Before implementing item CRUD, helper/contact workflows, trigger simulation, or
backup import/export, the app needs a stable local data contract that can be
persisted safely on one device. Without that contract, each page would invent
its own state shape, making migration, QA, and future monorepo extraction harder.

This change establishes the local-first product data foundation for the
standalone MVP. It should let later phases build real workflows on top of a
versioned, recoverable, testable snapshot without requiring backend accounts,
sync, push notifications, or remote execution.

## What Changes

- Add a local trust data model for standalone MVP product state.
- Define versioned snapshot contracts for:
  - important trust items;
  - trusted helpers/contacts;
  - item-to-helper assignment references;
  - local trigger/check-in policy settings;
  - audit-style metadata such as creation and update timestamps.
- Add local persistence helpers backed by AsyncStorage.
- Add default snapshot helpers for first launch and safe fallback.
- Add parsing and migration boundaries so malformed, missing, or unsupported
  data does not crash app startup.
- Add selectors or helper utilities that distinguish active records from
  archived records without hard-deleting local data.
- Add tests for missing storage, malformed storage, round-trip persistence,
  version fallback, and archived item behavior.

## Success Criteria

- A developer can import a local trust snapshot type and use it as the canonical
  contract for future item, helper, trigger, readiness, and backup phases.
- Loading trust data from empty AsyncStorage returns a complete default snapshot.
- Loading malformed JSON or structurally invalid data returns a safe default
  snapshot and does not throw.
- Saving and reloading a valid snapshot round-trips through AsyncStorage.
- Snapshot version handling is explicit, with clear behavior for current,
  missing, and unsupported future versions.
- Archived items remain stored locally but are excluded from active item helper
  utilities.
- The implementation remains local-only and does not add backend, sync, account,
  remote code execution, or UI CRUD behavior.

## Scope

In scope:

- TypeScript contracts for local standalone MVP trust data.
- AsyncStorage-backed load/save/clear helpers.
- Default snapshot creation.
- Safe parse and version boundary behavior.
- Helper utilities for active and archived records.
- Focused Jest coverage for the local data contract and persistence helpers.
- Minimal exports needed by future page/store work.

Out of scope:

- User-facing item CRUD screens.
- Helper/contact management UI.
- Trigger-state simulation UI.
- Backup file export/import.
- Encryption or secure enclave storage.
- Backend API contracts, account identity, multi-device sync, push notification,
  or remote execution behavior.
- Monorepo physical splitting.

## Existing Constraints

- Follow current project structure: route files stay thin, shared state belongs
  under `src/store`, and page UI remains under `src/pages`.
- Use AsyncStorage consistently with existing onboarding and skin storage
  helpers.
- Keep TypeScript strict-mode compatible.
- Do not introduce a new state management framework.
- Do not modify `.ai/`.
- Do not store mobile runtime data in the project-root `skins/` directory.
- New user-visible copy is not expected in this phase; if any is added later, it
  must be synchronized across `zh-CN`, `zh-TW`, and `en-US`.
