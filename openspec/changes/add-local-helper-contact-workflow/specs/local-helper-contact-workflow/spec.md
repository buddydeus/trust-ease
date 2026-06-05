# Local Helper Contact Workflow Specification

## ADDED Requirements

### Requirement: Helpers can be listed from local trust data

The app SHALL render trusted helpers or contacts from the local trust snapshot
without requiring backend, sync, address-book access, or network requests.

#### Scenario: Active local helpers are displayed

- **WHEN** the local trust snapshot contains active trusted helpers
- **THEN** the helper list SHALL display each helper display name
- **AND** it SHALL display relationship and contact method information
- **AND** it SHALL NOT require a backend or network request

#### Scenario: Archived helpers are hidden from default helper list

- **WHEN** the local trust snapshot contains archived trusted helpers
- **THEN** the default helper list SHALL exclude archived helpers
- **AND** archived helpers SHALL remain preserved in local storage

#### Scenario: Empty active helper list shows empty state

- **WHEN** the local trust snapshot has no active trusted helpers
- **THEN** the helper list SHALL show a calm empty state
- **AND** it SHALL provide a clear create-helper action

### Requirement: User can create local trusted helpers

The app SHALL let the user create a local trusted helper/contact and persist it
into the versioned local trust snapshot.

#### Scenario: Valid helper creation persists helper

- **WHEN** the user enters a valid display name, relationship, contact method,
  and optional notes
- **AND** the user saves the helper
- **THEN** the app SHALL append a new active `ITrustedHelper` to the local trust
  snapshot
- **AND** the new helper SHALL include a durable id, `createdAt`, and
  `updatedAt`
- **AND** the app SHALL return the user to a helper list or otherwise show the
  saved helper in the local workflow

#### Scenario: Empty helper display name is rejected

- **WHEN** the user attempts to save a helper with an empty display name
- **THEN** the app SHALL show or return a validation failure
- **AND** no new helper SHALL be persisted

#### Scenario: Empty helper contact method is rejected

- **WHEN** the user attempts to save a helper with an empty contact method
- **THEN** the app SHALL show or return a validation failure
- **AND** no new helper SHALL be persisted

### Requirement: User can edit local trusted helpers

The app SHALL let the user edit an existing local trusted helper/contact without
rewriting unrelated local trust data.

#### Scenario: Valid helper edit updates helper fields

- **WHEN** the user edits an existing helper display name, relationship,
  contact method, or notes with valid values
- **AND** the user saves the edit
- **THEN** the app SHALL update that helper in the local trust snapshot
- **AND** it SHALL update the helper's `updatedAt`
- **AND** it SHALL preserve the helper's `createdAt`
- **AND** it SHALL preserve unrelated items, trigger policy, and other helpers

#### Scenario: Editing missing helper fails safely

- **WHEN** an edit request targets a helper id that does not exist
- **THEN** the app SHALL NOT create a replacement helper implicitly
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: User can archive local trusted helpers

The app SHALL let the user archive a trusted helper/contact without
hard-deleting it.

#### Scenario: Archive marks helper archived

- **WHEN** the user archives an active helper
- **THEN** the helper SHALL remain in the local trust snapshot
- **AND** the helper status SHALL become `archived`
- **AND** the helper `updatedAt` SHALL be refreshed
- **AND** the default active helper list SHALL no longer show that helper

#### Scenario: Archiving missing helper fails safely

- **WHEN** an archive request targets a helper id that does not exist
- **THEN** the app SHALL NOT create a new helper
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: User can assign active helpers to local items

The app SHALL let the user associate active trusted helpers with local trust
items through `ITrustItem.helperIds`.

#### Scenario: Valid helper assignment updates item helper ids

- **WHEN** the user selects one or more active helpers for an existing local
  item
- **AND** the user saves the assignment or item edit
- **THEN** the app SHALL update that item's `helperIds` with the selected helper
  ids
- **AND** it SHALL update the item's `updatedAt`
- **AND** it SHALL preserve the item's title, kind, summary, status, and
  `createdAt`
- **AND** it SHALL preserve unrelated helpers, trigger policy, and other items

#### Scenario: Assignment deduplicates helper ids

- **WHEN** an assignment request contains duplicate helper ids
- **THEN** the stored item `helperIds` SHALL contain each selected helper id at
  most once
- **AND** the assignment SHALL preserve deterministic selection order

#### Scenario: Assignment rejects missing item

- **WHEN** an assignment request targets an item id that does not exist
- **THEN** the app SHALL NOT create a replacement item implicitly
- **AND** the existing local trust snapshot SHALL remain usable

#### Scenario: Assignment rejects unknown helper ids

- **WHEN** an assignment request contains a helper id that does not exist in the
  local trust snapshot
- **THEN** the app SHALL show or return a validation failure
- **AND** the existing local trust snapshot SHALL remain usable

#### Scenario: Assignment rejects archived helper ids

- **WHEN** an assignment request contains a helper id for an archived helper
- **THEN** the app SHALL show or return a validation failure
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: Helper contact workflow remains local-only

The helper/contact workflow SHALL support the standalone MVP without adding
networked product behavior or legal execution behavior.

#### Scenario: No backend dependency is introduced

- **WHEN** local helper/contact workflow is implemented
- **THEN** it SHALL NOT add backend account, sync, push notification, or API
  dependencies

#### Scenario: No address-book permission is introduced

- **WHEN** local helper/contact workflow is implemented
- **THEN** it SHALL NOT request device contacts permission
- **AND** it SHALL NOT read the device address book

#### Scenario: No automatic message delivery is introduced

- **WHEN** local helper/contact workflow is implemented
- **THEN** it SHALL NOT send SMS, email, push notification, or any other real
  message to helpers

#### Scenario: No legal execution is implied

- **WHEN** helper/contact UI explains helper expectations
- **THEN** the copy SHALL make clear that the app records a local plan
- **AND** it SHALL NOT imply legal authority, notarization, or automatic
  third-party account control

#### Scenario: New copy is localized

- **WHEN** local helper/contact workflow adds user-visible labels, actions,
  empty states, helper expectation text, assignment text, or validation messages
- **THEN** each copy key SHALL exist in `zh-CN`, `zh-TW`, and `en-US`
