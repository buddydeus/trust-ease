# local-backup-export-import Specification

## Purpose
TBD - created by archiving change add-local-backup-export-import. Update Purpose after archive.
## Requirements
### Requirement: Local trust backup export is versioned

The app SHALL export the current local trust data snapshot as a versioned,
local-only backup document.

#### Scenario: Export wraps current trust snapshot

- **WHEN** the user exports a backup
- **THEN** the backup payload SHALL include a Trust Ease product marker
- **AND** it SHALL include a backup schema version
- **AND** it SHALL include an export timestamp
- **AND** it SHALL include the current trust data schema version
- **AND** it SHALL include the current parsed local trust data snapshot

#### Scenario: Export validates snapshot before serialization

- **WHEN** a backup payload is created
- **THEN** the app SHALL validate the source snapshot through the supported
  local trust data parser
- **AND** invalid source data SHALL prevent backup serialization

#### Scenario: Export excludes runtime and remote package data

- **WHEN** a backup payload is created
- **THEN** it SHALL NOT include skin runtime directories
- **AND** it SHALL NOT include remote skin packages or caches
- **AND** it SHALL NOT include screenshots, logs, build artifacts, or app
  runtime cache files
- **AND** it SHALL NOT include third-party credentials or secrets outside the
  local trust data snapshot

### Requirement: Local trust backup import validates before write

The app SHALL parse and validate a selected local backup document before any
local trust data is overwritten.

#### Scenario: Valid backup produces preview

- **WHEN** the user selects a valid Trust Ease backup document
- **THEN** the app SHALL validate the product marker
- **AND** it SHALL validate the backup schema version
- **AND** it SHALL validate the embedded trust data schema version
- **AND** it SHALL parse the embedded snapshot through the supported local trust
  data parser
- **AND** it SHALL produce an import preview without writing local storage

#### Scenario: Malformed JSON fails safely

- **WHEN** the selected backup content is not valid JSON
- **THEN** the app SHALL show or return an import validation error
- **AND** the current local trust data SHALL remain unchanged

#### Scenario: Invalid envelope fails safely

- **WHEN** the selected backup content is missing required envelope fields
- **OR** the product marker is not recognized
- **OR** the backup schema version is unsupported
- **THEN** the app SHALL show or return an import validation error
- **AND** the current local trust data SHALL remain unchanged

#### Scenario: Unsupported trust snapshot fails safely

- **WHEN** the embedded trust snapshot has an unsupported, missing, or future
  trust data schema version
- **THEN** the app SHALL show or return an import validation error
- **AND** the current local trust data SHALL remain unchanged
- **AND** the app SHALL NOT attempt partial downgrade or partial import

#### Scenario: Structurally invalid trust snapshot fails safely

- **WHEN** the embedded trust snapshot does not match the supported local trust
  data structure
- **THEN** the app SHALL show or return an import validation error
- **AND** the current local trust data SHALL remain unchanged

### Requirement: Import preview explains replacement before confirmation

The app SHALL present a calm local preview of a valid backup before allowing it
to replace current local trust data.

#### Scenario: Preview summarizes backup contents

- **WHEN** a valid backup is parsed for preview
- **THEN** the preview SHALL show the backup export timestamp when available
- **AND** it SHALL summarize active item count
- **AND** it SHALL summarize active helper or contact count
- **AND** it SHALL summarize archived item and archived helper counts when
  applicable
- **AND** it SHALL summarize trigger policy or rehearsal state using local
  advisory language

#### Scenario: Preview states replacement semantics

- **WHEN** the import preview is rendered
- **THEN** it SHALL state that confirmed import replaces the current local plan
  on this device
- **AND** it SHALL require an explicit confirmation action before writing
- **AND** it SHALL offer a cancellation path that preserves current data

#### Scenario: Preview remains local and non-legal

- **WHEN** the import preview is rendered
- **THEN** it SHALL NOT imply cloud restore, backend sync, account recovery,
  helper notification, legal authority, notarization, inheritance handling, or
  third-party account control

### Requirement: Confirmed import writes through local trust storage

The app SHALL write imported trust data only after explicit confirmation and
only through the existing local trust data storage contract.

#### Scenario: Confirmed import replaces snapshot

- **WHEN** the user confirms import from a valid preview
- **THEN** the app SHALL save the parsed embedded trust snapshot through the
  existing local trust data save helper
- **AND** subsequent local trust data loads SHALL return the imported snapshot

#### Scenario: Cancelled import preserves snapshot

- **WHEN** the user cancels after a valid import preview
- **THEN** the app SHALL NOT write the imported snapshot
- **AND** the current local trust data SHALL remain unchanged

#### Scenario: Failed write reports error without partial merge

- **WHEN** saving the imported snapshot fails
- **THEN** the app SHALL report or surface a failure state
- **AND** it SHALL NOT attempt merge conflict resolution
- **AND** it SHALL NOT write partial imported data

### Requirement: Backup workflow is exposed from local settings

The app SHALL expose backup export/import as a user-initiated local settings
workflow.

#### Scenario: My page exposes backup entry

- **WHEN** the user opens the My or settings area
- **THEN** the app SHALL provide a backup/export/import entry or focused child
  route
- **AND** the entry SHALL explain that backup files are local and user-managed

#### Scenario: Export and import actions are explicit

- **WHEN** the backup workflow is rendered
- **THEN** export SHALL be a user-initiated action
- **AND** import SHALL be a user-initiated action
- **AND** background automatic backup SHALL NOT be introduced

#### Scenario: Backup copy is localized

- **WHEN** the backup workflow adds user-visible titles, descriptions, buttons,
  statuses, previews, confirmations, or errors
- **THEN** each copy key SHALL exist in `zh-CN`, `zh-TW`, and `en-US`

### Requirement: Backup workflow remains local-only

The backup export/import workflow SHALL support the standalone MVP without
adding networked or executable behavior.

#### Scenario: No backend dependency is introduced

- **WHEN** backup export/import is implemented
- **THEN** it SHALL NOT add backend account, cloud sync, push notification, API,
  or remote restore dependencies

#### Scenario: No remote execution is introduced

- **WHEN** backup import parses a selected file
- **THEN** it SHALL NOT execute remote JavaScript
- **AND** it SHALL NOT load arbitrary React components
- **AND** it SHALL NOT install plugins
- **AND** it SHALL NOT import executable content

#### Scenario: No encryption promise is introduced

- **WHEN** backup export/import copy is rendered
- **THEN** it SHALL NOT promise encryption, password protection, or secure
  cloud storage unless that protection is actually implemented

#### Scenario: No skin package export or import is introduced

- **WHEN** backup export/import is implemented
- **THEN** it SHALL NOT read project-root `skins/` as user backup data
- **AND** it SHALL NOT export or import Expo runtime skin package directories

