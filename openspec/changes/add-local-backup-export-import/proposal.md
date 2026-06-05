## Why

The standalone MVP now has enough local trust data to be useful, but it still has
a single-device durability gap: if the user loses the phone, reinstalls the app,
or changes devices, their prepared items, helpers, trigger policy, and readiness
state have no user-controlled recovery path.

Add a local-only backup export/import workflow so users can keep a copy of their
current plan and restore it on the same or another device without introducing
cloud sync, accounts, backend storage, or remote execution.

## What Changes

- Add a user-initiated local backup export capability for the current trust data
  snapshot.
- Add a user-initiated local backup import capability that validates and previews
  a backup before any local data is changed.
- Use a versioned backup envelope around the existing local trust data snapshot
  contract, with metadata such as backup schema version, export timestamp, and
  app/product identifier.
- Keep failed, cancelled, malformed, unsupported-version, and incompatible import
  attempts from overwriting existing local data.
- Add a settings or "My" area entry point that explains the local-only nature of
  backup files and requires explicit confirmation before replacing current data.
- Localize all user-visible backup/export/import copy for `zh-CN`, `zh-TW`, and
  `en-US`.

## Success Criteria

- Export produces a readable, versioned backup payload from the current valid
  local trust data snapshot.
- Import validates file shape, backup schema version, trust snapshot schema
  version, and required trust data before presenting an import preview.
- Import preview summarizes the backup contents and clearly states whether the
  current local data will be replaced.
- Existing local data remains unchanged when import parsing, validation, preview,
  cancellation, or confirmation fails.
- Confirmed import writes the parsed trust data through the existing local trust
  data storage contract.
- Tests cover export payload shape, import validation failures, no-write failure
  behavior, confirmed import behavior, and the visible workflow entry point.

## Scope

In scope:

- Local file/document export for the current local trust data snapshot.
- Local file/document import with validation, preview, and explicit confirmation.
- Initial restore mode may replace the current local trust data snapshot.
- Backup envelope and parsing utilities needed to keep the file contract stable.
- UI entry point and copy for local backup status, export, import preview, import
  confirmation, and import errors.

Out of scope:

- Cloud sync, user accounts, remote restore, backend storage, or network calls.
- Background automatic backup.
- Cross-device conflict resolution or merge workflows.
- Exporting skin runtime directories, remote skin packages, caches, screenshots,
  logs, or app build artifacts.
- Exporting third-party credentials or any secrets outside the local trust data
  snapshot.
- Encrypting backup files or promising cryptographic protection in this change.
- Importing remote JavaScript, plugins, arbitrary React components, or executable
  content.

## Existing Constraints

- Reuse the existing local trust data model and storage contract where possible,
  including `ITrustDataSnapshot`, `TRUST_DATA_SCHEMA_VERSION`,
  `parseTrustDataSnapshot`, and `saveTrustDataSnapshot`.
- Preserve the current Expo Router boundary: route files bind navigation,
  parameters, copy, and side effects; page UI lives under `src/pages`; shared
  trust logic lives under `src/store/trust`.
- Backup/export/import UX must stay calm and explicit: explain what will happen
  before high-risk import confirmation, avoid fear-based copy, and do not frame
  backup as legal, account, or third-party platform control.
- The workflow must be local-only and must not add real network dependencies.
- Do not modify `.ai/` content for this change.
