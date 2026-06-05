# Local Item CRUD Workflow Specification

## ADDED Requirements

### Requirement: Items screen uses local active items

The Items screen SHALL render active trust items from the local trust snapshot
instead of hard-coded sample item cards.

#### Scenario: Active local items are displayed

- **WHEN** the local trust snapshot contains active trust items
- **THEN** the Items screen SHALL display each active item title
- **AND** it SHALL display item kind and summary information for each item
- **AND** it SHALL NOT require a backend or network request

#### Scenario: Archived items are hidden from the default list

- **WHEN** the local trust snapshot contains archived trust items
- **THEN** the default Items screen list SHALL exclude archived items
- **AND** the archived items SHALL remain preserved in local storage

#### Scenario: Empty active list shows empty state

- **WHEN** the local trust snapshot has no active trust items
- **THEN** the Items screen SHALL show a calm empty state
- **AND** it SHALL provide a clear create-item action

#### Scenario: Circular add action opens create flow

- **WHEN** the user presses the Items screen circular add action
- **THEN** the app SHALL navigate to the local create-item flow

### Requirement: User can create local trust items

The app SHALL let the user create a local trust item and persist it into the
versioned local trust snapshot.

#### Scenario: Valid item creation persists item

- **WHEN** the user enters a valid title, supported item kind, and optional
  summary
- **AND** the user saves the item
- **THEN** the app SHALL append a new active `ITrustItem` to the local trust
  snapshot
- **AND** the new item SHALL include a durable id, empty `helperIds`,
  `createdAt`, and `updatedAt`
- **AND** the app SHALL navigate back to the Items tab or otherwise return the
  user to the item list

#### Scenario: Empty title is rejected

- **WHEN** the user attempts to save an item with an empty title
- **THEN** the app SHALL show a validation message
- **AND** no new item SHALL be persisted

#### Scenario: Unsupported item kind is rejected

- **WHEN** a create request contains an unsupported item kind
- **THEN** the app SHALL show or return a validation failure
- **AND** no new item SHALL be persisted

### Requirement: User can edit local trust items

The app SHALL let the user edit an existing local trust item without rewriting
unrelated local trust data.

#### Scenario: Valid edit updates item fields

- **WHEN** the user edits an existing item title, kind, or summary with valid
  values
- **AND** the user saves the edit
- **THEN** the app SHALL update that item in the local trust snapshot
- **AND** it SHALL update the item's `updatedAt`
- **AND** it SHALL preserve the item's `createdAt`
- **AND** it SHALL preserve unrelated helpers, trigger policy, and other items

#### Scenario: Editing missing item fails safely

- **WHEN** an edit request targets an item id that does not exist
- **THEN** the app SHALL NOT create a replacement item implicitly
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: User can archive local trust items

The app SHALL let the user archive an item without hard-deleting it.

#### Scenario: Archive marks item archived

- **WHEN** the user archives an active item
- **THEN** the item SHALL remain in the local trust snapshot
- **AND** the item status SHALL become `archived`
- **AND** the item `updatedAt` SHALL be refreshed
- **AND** the default active item list SHALL no longer show that item

#### Scenario: Archiving missing item fails safely

- **WHEN** an archive request targets an item id that does not exist
- **THEN** the app SHALL NOT create a new item
- **AND** the existing local trust snapshot SHALL remain usable

### Requirement: Local item CRUD remains local-only

The item CRUD workflow SHALL support the standalone MVP without adding networked
product behavior.

#### Scenario: No backend dependency is introduced

- **WHEN** local item CRUD is implemented
- **THEN** it SHALL NOT add backend account, sync, push notification, or API
  dependencies

#### Scenario: No helper management is introduced

- **WHEN** local item CRUD is implemented
- **THEN** it SHALL NOT add trusted helper/contact management UI
- **AND** it SHALL preserve item `helperIds` for future helper assignment work

#### Scenario: No trigger or backup behavior is introduced

- **WHEN** local item CRUD is implemented
- **THEN** it SHALL NOT add trigger simulation behavior
- **AND** it SHALL NOT add backup export/import behavior

#### Scenario: New copy is localized

- **WHEN** local item CRUD adds user-visible labels, actions, empty states, or
  validation messages
- **THEN** each copy key SHALL exist in `zh-CN`, `zh-TW`, and `en-US`
