# Design: Add Local Backup Export Import

## Overview

This change adds a local-only backup export/import workflow for the standalone
MVP. The app already stores a versioned local trust snapshot containing items,
trusted helpers, assignments, trigger policy, and readiness inputs. The missing
piece is a user-controlled way to carry that snapshot across reinstall, phone
replacement, or manual safekeeping.

The workflow must remain intentionally small:

- export writes a local backup document from the current trust snapshot;
- import reads a user-selected backup document, validates it, presents a preview,
  and only writes after explicit confirmation;
- all parsing and writes reuse the existing trust data contract;
- no cloud sync, account, backend, network call, remote code, skin package, or
  automatic background behavior is introduced.

## Backup Envelope

Define a backup envelope separate from the durable trust snapshot schema. The
envelope should wrap the existing `ITrustDataSnapshot` rather than changing it.

Suggested shape:

```ts
interface ILocalTrustBackupEnvelope {
  product: 'trust-ease';
  backupSchemaVersion: 1;
  exportedAt: string;
  trustDataSchemaVersion: typeof TRUST_DATA_SCHEMA_VERSION;
  snapshot: ITrustDataSnapshot;
}
```

The exact names may differ, but the file contract should keep these semantics:

- product/app marker identifies that the file belongs to Trust Ease;
- backup schema version governs the export/import file format;
- `exportedAt` is an ISO timestamp generated at export time;
- trust data schema version mirrors the snapshot version being exported;
- `snapshot` contains the parsed current local trust data.

Export output should be readable JSON. Pretty formatting is acceptable for the
MVP because it makes manual recovery and debugging easier. The export must not
include skin runtime state, remote package caches, screenshots, logs, app build
artifacts, or credentials outside the trust snapshot.

## Export Resolver and File Adapter

Add pure export helpers under `src/store/trust/`, likely `backup.ts`, that:

- accept an `ITrustDataSnapshot`;
- validate it through `parseTrustDataSnapshot`;
- create a backup envelope with injected or passed `exportedAt` for testability;
- serialize the envelope to JSON.

Keep platform file IO behind a small adapter so tests can run without native
file picker or share APIs. The route can call an adapter that writes the JSON to
a local document path and returns a user-facing result. Build may use existing
`expo-file-system` and, if necessary, add the smallest Expo-compatible document
picker/share dependency in a separate implementation step.

## Import Resolver and Preview

Import should be a two-step workflow:

1. parse and validate the selected backup document;
2. present a preview before writing.

Add pure import helpers that:

- parse raw text as JSON;
- validate the envelope product marker and backup schema version;
- reject missing or unsupported trust data schema versions;
- validate `snapshot` through `parseTrustDataSnapshot`;
- return a preview view model containing counts and metadata.

Suggested preview fields:

- `exportedAt`;
- `activeItemCount`;
- `activeHelperCount`;
- `archivedItemCount`;
- `archivedHelperCount`;
- `missingStateEnabled`;
- `simulationEnabled`;
- `willReplaceCurrentData: true`.

The preview should be advisory and local. It should clearly state that confirmed
import replaces the current local plan. Merge/conflict resolution is out of
scope for this change.

## Confirmation and Persistence

The route or controller that owns import confirmation should:

- keep the current local snapshot unchanged while parsing and previewing;
- require explicit user confirmation before persistence;
- write only the parsed snapshot using `saveTrustDataSnapshot`;
- reload or refresh the current UI after a successful import;
- surface cancellation and validation errors without throwing into the UI.

Malformed JSON, invalid envelope structure, wrong product marker, unsupported
backup schema, unsupported trust snapshot schema, invalid snapshot structure,
file read errors, user cancellation, and failed confirmation must not overwrite
existing local data.

## Page and Route Shape

Prefer the My page because it already hosts local settings, language, skin
runtime state, helper access, and trigger-state settings. The implementation can
either extend `MyScreen` with a compact backup card or introduce a focused child
route reached from the My page.

Recommended boundary:

- `src/app/(tabs)/my.tsx` or `src/app/my/backup.tsx` assembles i18n copy,
  invokes local storage and file adapters, and handles navigation/state;
- `src/pages/my/*` or `src/pages/backup/*` renders prop-driven UI;
- pure backup serialization, parsing, and preview logic lives under
  `src/store/trust/`;
- native file IO remains injected or wrapped so tests can mock it.

The import UI must not hide the destructive nature of replacement. It should
show a calm preview and require a clear confirm action before writing.

## UI and Copy

Copy should emphasize control and reversibility:

- export creates a local copy for safekeeping or device transfer;
- import first previews the selected backup;
- confirmed import replaces current local data on this device;
- the backup file should be stored carefully because it contains sensitive local
  plan information;
- the app is not adding cloud sync, account recovery, legal authority, or helper
  notification.

Avoid:

- promising encryption unless encryption is actually implemented;
- implying cloud backup, account restore, backend sync, or remote recovery;
- legal, notarization, inheritance, asset transfer, or third-party account
  control wording;
- fear-based wording around loss, death, or emergency.

All visible labels, explanations, statuses, errors, and buttons must be
localized in `zh-CN`, `zh-TW`, and `en-US`.

## Compatibility

- Existing local trust snapshots remain valid.
- The backup envelope is versioned independently from
  `TRUST_DATA_SCHEMA_VERSION`.
- Unsupported future backup or trust snapshot versions fail closed and preserve
  current data.
- Existing item CRUD, helper/contact workflow, trigger-state simulation,
  readiness summary, onboarding, skin runtime, screenshot, and i18n behavior
  should not regress.
- The project root `skins/` and Expo runtime skin directories must not be read
  or written by this backup workflow.

## Validation Strategy

Focused tests should cover:

- export envelope shape and product/version metadata;
- export validation of the current trust snapshot;
- import rejection for malformed JSON, wrong product, unsupported backup
  version, unsupported trust snapshot version, and invalid snapshot structure;
- import preview counts for active and archived records;
- cancelled or failed import leaves current local storage unchanged;
- confirmed import writes through `saveTrustDataSnapshot`;
- page renders local-only backup/export/import copy and replacement warning;
- route/controller maps export, import preview, cancel, and confirm behavior;
- localization keys exist in `zh-CN`, `zh-TW`, and `en-US`;
- no `.ai/` files are modified.

Recommended commands:

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/store/trust --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/pages/my --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:local
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-local-backup-export-import --strict
```
